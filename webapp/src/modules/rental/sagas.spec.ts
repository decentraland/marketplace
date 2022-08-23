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
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { getCurrentIdentity } from '../identity/selectors'
import { NFT } from '../nft/types'
import { VendorName } from '../vendor'
import { rentalsAPI } from '../vendor/decentraland/rentals/api'
import { getAddress } from '../wallet/selectors'
import {
  createRentalFailure,
  createRentalRequest,
  createRentalSuccess
} from './actions'
import { rentalSaga } from './sagas'
import { PeriodOption } from './types'
import { getNonces, getSignature } from './utils'

describe('when handling the CREATE_RENTAL_REQUEST action', () => {
  let nft: NFT
  let rental: RentalListing
  let identity: AuthIdentity

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
      periods: [
        { pricePerDay: '100000000000000000000', maxDays: 7, minDays: 7 }
      ],
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
