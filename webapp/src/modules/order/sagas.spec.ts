import {
  ChainId,
  Network,
  Order,
  RentalListing,
  RentalStatus
} from '@dcl/schemas'
import { setPurchase } from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import {
  ManaPurchase,
  NFTPurchase,
  PurchaseStatus
} from 'decentraland-dapps/dist/modules/gateway/types'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import {
  ProviderType,
  Wallet
} from 'decentraland-dapps/dist/modules/wallet/types'
import { ErrorCode } from 'decentraland-transactions'
import { NetworkGatewayType } from 'decentraland-ui'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { call, select } from 'redux-saga/effects'
import {
  buyAssetWithCard,
  BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
} from '../asset/utils'
import { closeModal, openModal } from '../modal/actions'
import { NFT } from '../nft/types'
import { getData as getNFTs } from '../nft/selectors'
import { getNFT } from '../nft/utils'
import { getRentalById } from '../rental/selectors'
import { waitUntilRentalChangesStatus } from '../rental/utils'
import { openTransak } from '../transak/actions'
import { VendorName } from '../vendor'
import { Vendor, VendorFactory } from '../vendor/VendorFactory'
import { getWallet } from '../wallet/selectors'
import {
  executeOrderFailure,
  executeOrderRequest,
  executeOrderSuccess,
  executeOrderTransactionSubmitted,
  executeOrderWithCardFailure,
  executeOrderWithCardRequest,
  executeOrderWithCardSuccess
} from './actions'
import { orderSaga } from './sagas'

let nft: NFT
let order: Order
let fingerprint: string
let txHash: string
let wallet: Wallet
let manaPurchase: ManaPurchase
let nftPurchase: NFTPurchase

beforeEach(() => {
  nft = {
    name: 'aName',
    contractAddress: 'aContractAddress',
    tokenId: 'aTokenId',
    openRentalId: null,
    vendor: VendorName.DECENTRALAND,
    chainId: ChainId.MATIC_MAINNET
  } as NFT
  order = {
    contractAddress: 'aContractAddress',
    tokenId: 'aTokenId',
    price: '100000000000'
  } as Order
  fingerprint = 'aFingerprint'
  txHash = '0x9fc518261399c1bd236997706347f8b117a061cef5518073b1c3eefd5efbff84'
  wallet = {
    address: 'anAddress',
    networks: {
      [Network.ETHEREUM]: { mana: 1, chainId: ChainId.ETHEREUM_GOERLI },
      [Network.MATIC]: { mana: 1, chainId: ChainId.MATIC_MAINNET }
    },
    network: Network.ETHEREUM,
    chainId: ChainId.ETHEREUM_GOERLI,
    providerType: ProviderType.NETWORK
  }
  manaPurchase = {
    address: 'anAddress',
    id: 'anId',
    network: Network.ETHEREUM,
    timestamp: 1671028355396,
    status: PurchaseStatus.PENDING,
    gateway: NetworkGatewayType.TRANSAK,
    txHash,
    amount: 10
  }
  nftPurchase = {
    ...manaPurchase,
    nft: {
      contractAddress: 'contractAddress',
      tokenId: 'anId',
      itemId: undefined,
      tradeType: TradeType.SECONDARY,
      cryptoAmount: 10
    }
  }
})

describe('when handling the execute order request action', () => {
  describe("and the nft doesn't have the same contract address as the order", () => {
    beforeEach(() => {
      order.contractAddress = 'anotherContractAddress'
    })

    it("should put the execute order failure with an error message saying that the order doesn't match the NFT", () => {
      return expectSaga(orderSaga)
        .put(
          executeOrderFailure(order, nft, 'The order does not match the NFT')
        )
        .dispatch(executeOrderRequest(order, nft, fingerprint))
        .run({ silenceTimeout: true })
    })
  })

  describe("and the nft doesn't have the same token id as the order", () => {
    beforeEach(() => {
      order.tokenId = 'anotherTokenId'
    })

    it("should put the execute order failure with the an error message saying that the order doesn't match the NFT", () => {
      return expectSaga(orderSaga)
        .put(
          executeOrderFailure(order, nft, 'The order does not match the NFT')
        )
        .dispatch(executeOrderRequest(order, nft, fingerprint))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the order execution fails', () => {
    let vendor: Vendor<VendorName>
    let error: Error & { code?: ErrorCode }
    let errorMessage: string

    beforeEach(() => {
      vendor = VendorFactory.build(nft.vendor)
      errorMessage = 'The execution was reverted'
      error = new Error(errorMessage)
      error.code = ErrorCode.SALE_PRICE_TOO_LOW
    })

    it('should put the execute order failure with the error message and the error code', () => {
      return expectSaga(orderSaga)
        .provide([
          [select(getWallet), wallet],
          [call([VendorFactory, 'build'], nft.vendor), vendor],
          [
            call(
              [vendor.orderService, 'execute'],
              wallet,
              nft,
              order,
              fingerprint
            ),
            throwError(error)
          ]
        ])
        .put(
          executeOrderFailure(
            order,
            nft,
            errorMessage,
            ErrorCode.SALE_PRICE_TOO_LOW
          )
        )
        .dispatch(executeOrderRequest(order, nft, fingerprint))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the order execution is successful', () => {
    let txHash: string
    let vendor: Vendor<VendorName>
    let rentalListing: RentalListing

    beforeEach(() => {
      txHash = 'aTxHash'
      vendor = VendorFactory.build(nft.vendor)
    })

    describe('and the NFT has a rental', () => {
      beforeEach(() => {
        nft.openRentalId = 'anOpenRentalId'
        rentalListing = {
          id: 'anOpenRentalId',
          status: RentalStatus.CANCELLED
        } as RentalListing
      })

      it('should wait for the transaction to be completed and the rental to change its status to cancelled and put the success action', () => {
        return expectSaga(orderSaga)
          .provide([
            [select(getWallet), wallet],
            [call([VendorFactory, 'build'], nft.vendor), vendor],
            [select(getRentalById, nft.openRentalId!), rentalListing],
            [
              call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED),
              Promise.resolve()
            ],
            [
              call(
                [vendor.orderService, 'execute'],
                wallet,
                nft,
                order,
                fingerprint
              ),
              Promise.resolve(txHash)
            ],
            [call(waitForTx, txHash), Promise.resolve()]
          ])
          .put(executeOrderTransactionSubmitted(order, nft, txHash))
          .put(executeOrderSuccess())
          .dispatch(executeOrderRequest(order, nft, fingerprint))
          .run({ silenceTimeout: true })
      })
    })

    describe("and the NFT doesn't have a rental", () => {
      beforeEach(() => {
        nft.openRentalId = null
      })

      it('should put the success action', () => {
        return expectSaga(orderSaga)
          .provide([
            [call([VendorFactory, 'build'], nft.vendor), vendor],
            [select(getWallet), wallet],
            [
              call(
                [vendor.orderService, 'execute'],
                wallet,
                nft,
                order,
                fingerprint
              ),
              Promise.resolve(txHash)
            ]
          ])
          .put(executeOrderTransactionSubmitted(order, nft, txHash))
          .dispatch(executeOrderRequest(order, nft, fingerprint))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the execute order with card action', () => {
  beforeEach(() => {
    jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when the explanation modal has already been shown', () => {
    it('should open Transak widget', () => {
      return expectSaga(orderSaga)
        .provide([
          [
            call(
              [localStorage, 'getItem'],
              BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
            ),
            'true'
          ]
        ])
        .put(openTransak(nft))
        .dispatch(executeOrderWithCardRequest(nft))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(localStorage.setItem).not.toHaveBeenCalled()
        })
    })
  })

  describe('when the explanation modal is shown and the user closes it', () => {
    it('should not set the item in the local storage to show the modal again later', () => {
      return expectSaga(orderSaga)
        .provide([
          [
            call(
              [localStorage, 'getItem'],
              BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
            ),
            null
          ]
        ])
        .put(openModal('BuyWithCardExplanationModal', { asset: nft }))
        .dispatch(executeOrderWithCardRequest(nft))
        .dispatch(closeModal('BuyWithCardExplanationModal'))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(localStorage.setItem).not.toHaveBeenCalled()
        })
    })
  })

  describe('when opening Transak Widget fails', () => {
    let errorMessage: string

    beforeEach(() => {
      errorMessage = 'The execution was reverted'
    })

    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(orderSaga)
        .provide([
          [call(buyAssetWithCard, nft), Promise.reject(new Error(errorMessage))]
        ])
        .put(executeOrderWithCardFailure(errorMessage))
        .dispatch(executeOrderWithCardRequest(nft))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the set purchase action', () => {
  describe('when it is a MANA purchase', () => {
    it('should not put any new action', () => {
      return expectSaga(orderSaga)
        .dispatch(setPurchase(manaPurchase))
        .run({ silenceTimeout: true })
        .then(({ effects }) => {
          expect(effects.put).toBeUndefined()
        })
    })
  })

  describe('when it is an NFT purchase', () => {
    describe('when it is a primary market purchase', () => {
      it('should not put any new action', () => {
        return expectSaga(orderSaga)
          .dispatch(
            setPurchase({
              ...nftPurchase,
              nft: {
                ...nftPurchase.nft,
                itemId: nftPurchase.nft.tokenId,
                tradeType: TradeType.PRIMARY,
                tokenId: undefined
              }
            })
          )
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('when it is incomplete', () => {
      it('should not put any new action', () => {
        return expectSaga(orderSaga)
          .provide([[select(getNFTs), {}]])
          .dispatch(setPurchase(nftPurchase))
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('when it is complete without a txHash', () => {
      it('should not put any new action', () => {
        return expectSaga(orderSaga)
          .provide([[select(getNFTs), {}]])
          .dispatch(
            setPurchase({
              ...nftPurchase,
              txHash: null,
              status: PurchaseStatus.COMPLETE
            })
          )
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('when it is a complete and it has a txHash', () => {
      describe('when the item does not exist', () => {
        it('should not put any new action', () => {
          return expectSaga(orderSaga)
            .provide([[select(getNFTs), {}]])
            .dispatch(
              setPurchase({
                ...nftPurchase,
                txHash,
                status: PurchaseStatus.COMPLETE
              })
            )
            .run({ silenceTimeout: true })
            .then(({ effects }) => {
              expect(effects.put).toBeUndefined()
            })
        })
      })

      describe('when the item exists', () => {
        it('should not put any new action', () => {
          const nfts = { anNFTId: nft }
          const { contractAddress, tokenId } = nftPurchase.nft

          return expectSaga(orderSaga)
            .provide([
              [select(getNFTs), nfts],
              [call(getNFT, contractAddress, tokenId, nfts), nft]
            ])
            .put(
              executeOrderWithCardSuccess(
                {
                  ...nftPurchase,
                  status: PurchaseStatus.COMPLETE
                },
                nft,
                txHash
              )
            )
            .dispatch(
              setPurchase({
                ...nftPurchase,
                txHash,
                status: PurchaseStatus.COMPLETE
              })
            )
            .run({ silenceTimeout: true })
        })
      })
    })
  })
})
