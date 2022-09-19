import {
  ChainId,
  Network,
  NFTCategory,
  PeriodCreation,
  RentalListing,
  RentalStatus
} from '@dcl/schemas'
import { call, select } from '@redux-saga/core/effects'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { getCurrentIdentity } from '../identity/selectors'
import { closeModal } from '../modal/actions'
import { NFT } from '../nft/types'
import { VendorName } from '../vendor'
import { rentalsAPI } from '../vendor/decentraland/rentals/api'
import { getAddress } from '../wallet/selectors'
import {
  claimLandFailure,
  claimLandRequest,
  claimLandTransactionSubmitted,
  claimLandSuccess,
  clearRentalErrors,
  createRentalFailure,
  createRentalRequest,
  createRentalSuccess,
  removeRentalFailure,
  removeRentalRequest,
  removeRentalTransactionSubmitted
} from './actions'
import { rentalSaga } from './sagas'
import { PeriodOption } from './types'
import { getNonces, getSignature } from './utils'

let nft: NFT
let rental: RentalListing

beforeEach(() => {
  nft = {
    id: '0xdeadbeef-someNFT',
    name: 'Some NFT',
    category: NFTCategory.PARCEL,
    contractAddress: '0xdeadbeef',
    tokenId: 'someNFT',
    data: {
      parcel: {
        x: '0',
        y: '0',
        estate: null,
        description: 'Some parcel'
      }
    },
    image: '',
    owner: '0xdeadbeef',
    soldAt: 1234567,
    updatedAt: 1234567,
    createdAt: 1234567,
    openRentalId: null,
    url: '',
    issuedId: null,
    itemId: null,
    vendor: VendorName.DECENTRALAND,
    network: Network.ETHEREUM,
    chainId: ChainId.ETHEREUM_GOERLI,
    activeOrderId: null
  }

  rental = {
    id: 'some-rental',
    nftId: '0xdeadbeef-someNFT',
    contractAddress: '0xdeadbeef',
    rentalContractAddress: '0xdeadbeef',
    nonces: ['0', '0', '0'],
    periods: [{ pricePerDay: '100000000000000000000', maxDays: 7, minDays: 7 }],
    signature: 'the-signature',
    chainId: ChainId.ETHEREUM_GOERLI,
    network: Network.ETHEREUM,
    status: RentalStatus.OPEN,
    category: NFTCategory.PARCEL,
    tokenId: 'someNFT',
    searchText: 'some nft',
    lessor: '0xdeadbeef',
    tenant: '0xdeadbeef',
    expiration: 1234567,
    startedAt: 1234567,
    updatedAt: 1234567,
    createdAt: 1234567
  }
})

describe('when handling the CREATE_RENTAL_REQUEST action', () => {
  let identity: AuthIdentity

  beforeEach(() => {
    identity = {
      ephemeralIdentity: {
        address: '',
        privateKey: '',
        publicKey: ''
      },
      expiration: new Date(0),
      authChain: []
    }
  })

  describe('and the wallet is not connected', () => {
    it('should throw an "Invalid address" error', () => {
      return expectSaga(rentalSaga)
        .provide([[select(getAddress), undefined]])
        .put(
          createRentalFailure(
            nft,
            100,
            [PeriodOption.ONE_WEEK],
            1234567,
            'Invalid address'
          )
        )
        .dispatch(
          createRentalRequest(nft, 100, [PeriodOption.ONE_WEEK], 1234567)
        )
        .run({ silenceTimeout: true })
    })
  })

  describe('and the wallet is connected', () => {
    it('should create a rental', () => {
      const signerAddress = '0xdeadbeef'
      const nonces = ['0', '0', '0']
      const periods: PeriodCreation[] = [
        {
          pricePerDay: '100000000000000000000',
          maxDays: 7,
          minDays: 7
        }
      ]
      const expiration = 1234567
      const signature = 'the-signature'
      return expectSaga(rentalSaga)
        .provide([
          [select(getAddress), signerAddress],
          [
            call(
              getNonces,
              nft.chainId,
              nft.contractAddress,
              nft.tokenId,
              signerAddress
            ),
            nonces
          ],
          [
            call(
              getSignature,
              nft.chainId,
              nft.contractAddress,
              nft.tokenId,
              nonces,
              periods,
              expiration
            ),
            signature
          ],
          [select(getCurrentIdentity), identity],
          [
            call(
              [rentalsAPI, 'createRentalListing'],
              {
                chainId: nft.chainId,
                contractAddress: nft.contractAddress,
                tokenId: nft.tokenId,
                network: nft.network,
                expiration,
                rentalContractAddress:
                  '0xbb2a03bf5f525734cb0536be4be61ba788d7ee01',
                nonces,
                periods,
                signature
              },
              identity
            ),
            rental
          ]
        ])
        .put(createRentalSuccess(nft, rental))
        .dispatch(
          createRentalRequest(nft, 100, [PeriodOption.ONE_WEEK], expiration)
        )
        .run({ silenceTimeout: true })
    })
    describe('and can not get the nonces', () => {
      it('should throw an error', () => {
        const signerAddress = '0xdeadbeef'
        const expiration = 1234567
        return expectSaga(rentalSaga)
          .provide([
            [select(getAddress), signerAddress],
            [
              call(
                getNonces,
                nft.chainId,
                nft.contractAddress,
                nft.tokenId,
                signerAddress
              ),
              throwError(new Error('Could not get provider'))
            ]
          ])
          .put(
            createRentalFailure(
              nft,
              100,
              [PeriodOption.ONE_WEEK],
              1234567,
              'Could not get provider'
            )
          )
          .dispatch(
            createRentalRequest(nft, 100, [PeriodOption.ONE_WEEK], expiration)
          )
          .run({ silenceTimeout: true })
      })
    })
    describe('and can not get the signature', () => {
      it('should throw an error', () => {
        const signerAddress = '0xdeadbeef'
        const nonces = ['0', '0', '0']
        const periods: PeriodCreation[] = [
          {
            pricePerDay: '100000000000000000000',
            maxDays: 7,
            minDays: 7
          }
        ]
        const expiration = 1234567
        return expectSaga(rentalSaga)
          .provide([
            [select(getAddress), signerAddress],
            [
              call(
                getNonces,
                nft.chainId,
                nft.contractAddress,
                nft.tokenId,
                signerAddress
              ),
              nonces
            ],
            [
              call(
                getSignature,
                nft.chainId,
                nft.contractAddress,
                nft.tokenId,
                nonces,
                periods,
                expiration
              ),
              throwError(new Error('Could not get provider'))
            ]
          ])
          .put(
            createRentalFailure(
              nft,
              100,
              [PeriodOption.ONE_WEEK],
              1234567,
              'Could not get provider'
            )
          )
          .dispatch(
            createRentalRequest(nft, 100, [PeriodOption.ONE_WEEK], expiration)
          )
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the request action to claim a LAND', () => {
  let rentalContract: ContractData
  beforeEach(() => {
    rentalContract = {
      abi: [],
      address: '0x0',
      name: 'Rental Contract',
      version: 'v1',
      chainId: nft.chainId
    }
  })

  describe("and the provider can't be retrieved", () => {
    it('should put a claim LAND failure action with the error', () => {
      return expectSaga(rentalSaga)
        .provide([[call(getConnectedProvider), null]])
        .put(claimLandFailure('A provider is required to claim LAND'))
        .dispatch(claimLandRequest(nft, rental))
        .silentRun()
    })
  })

  describe("and the connected wallet address can't be retrieved", () => {
    it('should put a claim LAND failure action with the error', () => {
      return expectSaga(rentalSaga)
        .provide([
          [call(getConnectedProvider), {}],
          [select(getAddress), undefined]
        ])
        .put(claimLandFailure('An address is required to claim LAND'))
        .dispatch(claimLandRequest(nft, rental))
        .silentRun()
    })
  })

  describe('and getting the rental contract throws', () => {
    it('should put a claim LAND failure action with the error', () => {
      return expectSaga(rentalSaga)
        .provide([
          [call(getConnectedProvider), {}],
          [select(getAddress), '0xEf924C0611035DF4DecfAb7300320c92f68B0F45'],
          [
            call(getContract, ContractName.Rentals, nft.chainId),
            throwError(new Error('anError'))
          ]
        ])
        .put(claimLandFailure('anError'))
        .dispatch(claimLandRequest(nft, rental))
        .silentRun()
    })
  })

  describe('and sending the transaction fails', () => {
    it('should put claim LAND failure action with the error', () => {
      return expectSaga(rentalSaga)
        .provide([
          [call(getConnectedProvider), {}],
          [select(getAddress), '0xEf924C0611035DF4DecfAb7300320c92f68B0F45'],
          [
            call(getContract, ContractName.Rentals, nft.chainId),
            rentalContract
          ],
          [
            call(
              sendTransaction as (
                contract: ContractData,
                contractMethodName: string,
                ...contractArguments: any[]
              ) => Promise<string>,
              rentalContract,
              'claim(address,uint256)',
              nft.contractAddress,
              nft.tokenId
            ),
            Promise.reject(new Error('anError'))
          ]
        ])
        .put(claimLandFailure('anError'))
        .dispatch(claimLandRequest(nft, rental))
        .silentRun()
    })
  })

  describe('and sending the transaction is successful', () => {
    const txHash = '0x01'

    describe('and the transaction finishes', () => {
      it('should put the action to notify that the transaction was submitted and the claim LAND success action', () => {
        return expectSaga(rentalSaga)
          .provide([
            [call(getConnectedProvider), {}],
            [select(getAddress), '0xEf924C0611035DF4DecfAb7300320c92f68B0F45'],
            [
              call(getContract, ContractName.Rentals, nft.chainId),
              rentalContract
            ],
            [
              call(
                sendTransaction as (
                  contract: ContractData,
                  contractMethodName: string,
                  ...contractArguments: any[]
                ) => Promise<string>,
                rentalContract,
                'claim(address,uint256)',
                nft.contractAddress,
                nft.tokenId
              ),
              Promise.resolve(txHash)
            ],
            [call(waitForTx, txHash), Promise.resolve()]
          ])
          .put(
            claimLandTransactionSubmitted(nft, txHash, rentalContract.address)
          )
          .put(claimLandSuccess(nft, rental))
          .dispatch(claimLandRequest(nft, rental))
          .silentRun()
      })
    })

    describe('and the transaction gets reverted', () => {
      it('should put the action to notify that the transaction was submitted and the claim LAND failure action with an error', () => {
        return expectSaga(rentalSaga)
          .provide([
            [call(getConnectedProvider), {}],
            [select(getAddress), '0xEf924C0611035DF4DecfAb7300320c92f68B0F45'],
            [
              call(getContract, ContractName.Rentals, nft.chainId),
              rentalContract
            ],
            [
              call(
                sendTransaction as (
                  contract: ContractData,
                  contractMethodName: string,
                  ...contractArguments: any[]
                ) => Promise<string>,
                rentalContract,
                'claim(address,uint256)',
                nft.contractAddress,
                nft.tokenId
              ),
              Promise.resolve(txHash)
            ],
            [call(waitForTx, txHash), Promise.reject(new Error('anError'))]
          ])
          .put(
            claimLandTransactionSubmitted(nft, txHash, rentalContract.address)
          )
          .put(claimLandFailure('anError'))
          .dispatch(claimLandRequest(nft, rental))
          .silentRun()
      })
    })
  })
})

describe('when handling the request action to remove a rental', () => {
  let rentalContract: ContractData
  beforeEach(() => {
    rentalContract = {
      abi: [],
      address: '0x0',
      name: 'Rental Contract',
      version: 'v1',
      chainId: nft.chainId
    }
    nft = {
      ...nft,
      openRentalId: rental.id
    }
  })

  describe('and the NFT does not have an open rental', () => {
    beforeEach(() => {
      nft = {
        ...nft,
        openRentalId: null
      }
    })

    it('should put a remove rental failure action with the error', () => {
      return expectSaga(rentalSaga)
        .provide([[call(getConnectedProvider), null]])
        .put(
          removeRentalFailure('The provided NFT does not have an open rental')
        )
        .dispatch(removeRentalRequest(nft))
        .silentRun()
    })
  })

  describe("and the provider can't be retrieved", () => {
    it('should put a remove rental failure action with the error', () => {
      return expectSaga(rentalSaga)
        .provide([[call(getConnectedProvider), null]])
        .put(removeRentalFailure('A provider is required to remove a rental'))
        .dispatch(removeRentalRequest(nft))
        .silentRun()
    })
  })

  describe("and the connected wallet address can't be retrieved", () => {
    it('should put a remove rental failure action with the error', () => {
      return expectSaga(rentalSaga)
        .provide([
          [call(getConnectedProvider), {}],
          [select(getAddress), undefined]
        ])
        .put(removeRentalFailure('An address is required to remove a rental'))
        .dispatch(removeRentalRequest(nft))
        .silentRun()
    })
  })

  describe('and getting the rental contract throws', () => {
    it('should put a remove rental failure action with the error', () => {
      return expectSaga(rentalSaga)
        .provide([
          [call(getConnectedProvider), {}],
          [select(getAddress), '0xEf924C0611035DF4DecfAb7300320c92f68B0F45'],
          [
            call(getContract, ContractName.Rentals, nft.chainId),
            throwError(new Error('anError'))
          ]
        ])
        .put(removeRentalFailure('anError'))
        .dispatch(removeRentalRequest(nft))
        .silentRun()
    })
  })

  describe('and sending the transaction fails', () => {
    it('should put a remove rental failure action with the error', () => {
      return expectSaga(rentalSaga)
        .provide([
          [call(getConnectedProvider), {}],
          [select(getAddress), '0xEf924C0611035DF4DecfAb7300320c92f68B0F45'],
          [
            call(getContract, ContractName.Rentals, nft.chainId),
            rentalContract
          ],
          [
            call(
              sendTransaction as (
                contract: ContractData,
                contractMethodName: string,
                ...contractArguments: any[]
              ) => Promise<string>,
              rentalContract,
              'bumpAssetIndex(address,uint256)',
              nft.contractAddress,
              nft.tokenId
            ),
            Promise.reject(new Error('anError'))
          ]
        ])
        .put(removeRentalFailure('anError'))
        .dispatch(removeRentalRequest(nft))
        .silentRun()
    })
  })

  describe('and sending the transaction is successful', () => {
    const txHash = '0x01'

    describe('and the transaction finishes', () => {
      it('should put the action to notify that the transaction was submitted and the remove rental success action', () => {
        return expectSaga(rentalSaga)
          .provide([
            [call(getConnectedProvider), {}],
            [select(getAddress), '0xEf924C0611035DF4DecfAb7300320c92f68B0F45'],
            [
              call(getContract, ContractName.Rentals, nft.chainId),
              rentalContract
            ],
            [
              call(
                sendTransaction as (
                  contract: ContractData,
                  contractMethodName: string,
                  ...contractArguments: any[]
                ) => Promise<string>,
                rentalContract,
                'claim(address,uint256)',
                nft.contractAddress,
                nft.tokenId
              ),
              Promise.resolve(txHash)
            ],
            [call(waitForTx, txHash), Promise.resolve()]
          ])
          .put(
            claimLandTransactionSubmitted(nft, txHash, rentalContract.address)
          )
          .put(claimLandSuccess(nft, rental))
          .dispatch(claimLandRequest(nft, rental))
          .silentRun()
      })
    })

    describe('and the transaction gets reverted', () => {
      it('should put the action to notify that the transaction was submitted and the remove rental failure action with an error', () => {
        return expectSaga(rentalSaga)
          .provide([
            [call(getConnectedProvider), {}],
            [select(getAddress), '0xEf924C0611035DF4DecfAb7300320c92f68B0F45'],
            [
              call(getContract, ContractName.Rentals, nft.chainId),
              rentalContract
            ],
            [
              call(
                sendTransaction as (
                  contract: ContractData,
                  contractMethodName: string,
                  ...contractArguments: any[]
                ) => Promise<string>,
                rentalContract,
                'bumpAssetIndex(address,uint256)',
                nft.contractAddress,
                nft.tokenId
              ),
              Promise.resolve(txHash)
            ],
            [call(waitForTx, txHash), Promise.reject(new Error('anError'))]
          ])
          .put(removeRentalTransactionSubmitted(nft, txHash))
          .put(removeRentalFailure('anError'))
          .dispatch(removeRentalRequest(nft))
          .silentRun()
      })
    })
  })
})

describe('when handling the action to close the claim LAND modal', () => {
  it('should put the action to clear the rental errors', () => {
    return expectSaga(rentalSaga)
      .put(clearRentalErrors())
      .dispatch(closeModal('ClaimLandModal'))
      .silentRun()
  })
})

describe('when handling the action to close the remove rental modal', () => {
  it('should put the action to clear the rental errors', () => {
    return expectSaga(rentalSaga)
      .put(clearRentalErrors())
      .dispatch(closeModal('RemoveRentalModal'))
      .silentRun()
  })
})
