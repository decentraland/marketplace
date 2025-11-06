import { call, select, take } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { v4 as uuidv4 } from 'uuid'
import { ChainId, Network, Order, RentalListing, RentalStatus, Trade } from '@dcl/schemas'
import { CreditsService } from 'decentraland-dapps/dist/lib/credits'
import { pollCreditsBalanceRequest } from 'decentraland-dapps/dist/modules/credits/actions'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { setPurchase } from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { ManaPurchase, NFTPurchase, PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { closeModal, openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { ProviderType, Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ContractName, ErrorCode, getContract } from 'decentraland-transactions'
import { NetworkGatewayType } from 'decentraland-ui'
import { API_SIGNER } from '../../lib/api'
import { buyAssetWithCard, BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY } from '../asset/utils'
import { getIsCreditsEnabled } from '../features/selectors'
import { waitForFeatureFlagsToBeLoaded } from '../features/utils'
import { fetchNFTRequest, FETCH_NFT_FAILURE } from '../nft/actions'
import { getData as getNFTs } from '../nft/selectors'
import { NFT } from '../nft/types'
import { getNFT } from '../nft/utils'
import { getRentalById } from '../rental/selectors'
import { waitUntilRentalChangesStatus } from '../rental/utils'
import { openTransak } from '../transak/actions'
import { VendorName } from '../vendor'
import { MARKETPLACE_SERVER_URL } from '../vendor/decentraland'
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
let contractAddress: string
let tokenId: string
let tradeService: TradeService

beforeEach(() => {
  contractAddress = 'contractAddress'
  tokenId = 'anId'

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
    paymentMethod: 'paymentMethod',
    amount: 10
  }
  nftPurchase = {
    ...manaPurchase,
    nft: {
      contractAddress,
      tokenId,
      itemId: undefined,
      tradeType: TradeType.SECONDARY,
      cryptoAmount: 10
    }
  }

  tradeService = new TradeService(API_SIGNER, MARKETPLACE_SERVER_URL, () => undefined)
})

describe('when handling the execute order request action', () => {
  describe("and the nft doesn't have the same contract address as the order", () => {
    beforeEach(() => {
      order.contractAddress = 'anotherContractAddress'
    })

    it("should put the execute order failure with an error message saying that the order doesn't match the NFT", () => {
      return expectSaga(orderSaga, tradeService)
        .provide([[matchers.call.fn(waitForFeatureFlagsToBeLoaded), true]])
        .put(executeOrderFailure(order, nft, 'The order does not match the NFT'))
        .dispatch(executeOrderRequest(order, nft, fingerprint))
        .run({ silenceTimeout: true })
    })
  })

  describe("and the nft doesn't have the same token id as the order", () => {
    beforeEach(() => {
      order.tokenId = 'anotherTokenId'
    })

    it("should put the execute order failure with the an error message saying that the order doesn't match the NFT", () => {
      return expectSaga(orderSaga, tradeService)
        .put(executeOrderFailure(order, nft, 'The order does not match the NFT'))
        .dispatch(executeOrderRequest(order, nft, fingerprint))
        .run({ silenceTimeout: true })
    })
  })

  describe('when executing an order with a trade using credits', () => {
    let trade: Trade
    let mockCredits: CreditsResponse

    beforeEach(() => {
      order = {
        ...order,
        tradeId: uuidv4()
      }

      mockCredits = {
        totalCredits: 200000000000,
        credits: [
          {
            id: '1',
            amount: '200000000000',
            availableAmount: '200000000000',
            contract: '0x123',
            expiresAt: '1000',
            season: 1,
            signature: '123',
            timestamp: '1000',
            userAddress: wallet.address
          }
        ]
      }

      trade = {
        contract: getContract(ContractName.OffChainMarketplaceV2, ChainId.ETHEREUM_SEPOLIA).address,
        id: order.tradeId!,
        createdAt: Date.now(),
        signer: wallet.address,
        signature: '0x324234',
        type: 'public_nft_order',
        network: Network.ETHEREUM,
        chainId: ChainId.ETHEREUM_SEPOLIA,
        checks: {
          expiration: Date.now() + 100000000000,
          effective: Date.now(),
          uses: 1,
          salt: '0x',
          allowedRoot: '0x',
          contractSignatureIndex: 0,
          externalChecks: [],
          signerSignatureIndex: 0
        },
        sent: [],
        received: []
      } as Trade
    })

    describe('and credits are enabled and available', () => {
      it('should execute the order with credits and poll the credits balance', () => {
        return expectSaga(orderSaga, tradeService)
          .provide([
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
            [select(getWallet), wallet],
            [select(getIsCreditsEnabled), true],
            [select(getCredits, wallet.address), mockCredits],
            [matchers.call.fn(TradeService.prototype.fetchTrade), trade],
            [matchers.call.fn(CreditsService.prototype.useCreditsMarketplace), Promise.resolve(txHash)]
          ])
          .put(executeOrderTransactionSubmitted(order, nft, txHash))
          .put(executeOrderSuccess(txHash, nft))
          .put(pollCreditsBalanceRequest(wallet.address, BigInt(mockCredits.totalCredits) - BigInt(order.price)))
          .dispatch(executeOrderRequest(order, nft, fingerprint, false, true))
          .run({ silenceTimeout: true })
      })
    })

    describe('and credits are not enabled', () => {
      it('should fail with an error message saying that credits are not enabled', () => {
        return expectSaga(orderSaga, tradeService)
          .provide([
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
            [matchers.call.fn(TradeService.prototype.fetchTrade), trade],
            [select(getWallet), wallet],
            [select(getIsCreditsEnabled), false]
          ])
          .put(executeOrderFailure(order, nft, 'Credits are not enabled', undefined, false))
          .dispatch(executeOrderRequest(order, nft, fingerprint, false, true))
          .run({ silenceTimeout: true })
      })
    })

    describe('and no credits are available', () => {
      it('should fail with an error message saying that no credits are available', () => {
        return expectSaga(orderSaga, tradeService)
          .provide([
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
            [matchers.call.fn(TradeService.prototype.fetchTrade), trade],
            [select(getWallet), wallet],
            [select(getIsCreditsEnabled), true],
            [select(getCredits, wallet.address), undefined]
          ])
          .put(executeOrderFailure(order, nft, 'No credits available', undefined, false))
          .dispatch(executeOrderRequest(order, nft, fingerprint, false, true))
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when executing an order with the legacy marketplace using credits', () => {
    let vendor: Vendor<VendorName>
    let mockCredits: CreditsResponse

    beforeEach(() => {
      vendor = VendorFactory.build(nft.vendor, undefined)

      mockCredits = {
        totalCredits: 200000000000,
        credits: [
          {
            id: '1',
            amount: '200000000000',
            availableAmount: '200000000000',
            contract: '0x123',
            expiresAt: '1000',
            season: 1,
            signature: '123',
            timestamp: '1000',
            userAddress: wallet.address
          }
        ]
      }
    })

    describe('and credits are enabled and available', () => {
      it('should execute the order with credits and poll the credits balance', () => {
        return expectSaga(orderSaga, tradeService)
          .provide([
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
            [select(getWallet), wallet],
            [select(getIsCreditsEnabled), true],
            [select(getCredits, wallet.address), mockCredits],
            [call([VendorFactory, 'build'], nft.vendor, undefined), vendor],
            [matchers.call.fn(CreditsService.prototype.useCreditsLegacyMarketplace), Promise.resolve(txHash)]
          ])
          .put(executeOrderTransactionSubmitted(order, nft, txHash))
          .put(executeOrderSuccess(txHash, nft))
          .put(pollCreditsBalanceRequest(wallet.address, BigInt(mockCredits.totalCredits) - BigInt(order.price)))
          .dispatch(executeOrderRequest(order, nft, fingerprint, false, true))
          .run({ silenceTimeout: true })
      })
    })

    describe('and credits are not enabled', () => {
      it('should fail with an error message saying that credits are not enabled', () => {
        return expectSaga(orderSaga, tradeService)
          .provide([
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
            [select(getWallet), wallet],
            [select(getIsCreditsEnabled), false],
            [call([VendorFactory, 'build'], nft.vendor, undefined), vendor]
          ])
          .put(executeOrderFailure(order, nft, 'Credits are not enabled', undefined, false))
          .dispatch(executeOrderRequest(order, nft, fingerprint, false, true))
          .run({ silenceTimeout: true })
      })
    })

    describe('and no credits are available', () => {
      it('should fail with an error message saying that no credits are available', () => {
        return expectSaga(orderSaga, tradeService)
          .provide([
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
            [select(getWallet), wallet],
            [select(getIsCreditsEnabled), true],
            [select(getCredits, wallet.address), undefined],
            [call([VendorFactory, 'build'], nft.vendor, undefined), vendor]
          ])
          .put(executeOrderFailure(order, nft, 'No credits available', undefined, false))
          .dispatch(executeOrderRequest(order, nft, fingerprint, false, true))
          .run({ silenceTimeout: true })
      })
    })

    describe('and credits amount is zero', () => {
      it('should fail with an error message saying that no credits are available', () => {
        return expectSaga(orderSaga, tradeService)
          .provide([
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
            [select(getWallet), wallet],
            [select(getIsCreditsEnabled), true],
            [select(getCredits, wallet.address), { ...mockCredits, totalCredits: 0 }],
            [call([VendorFactory, 'build'], nft.vendor, undefined), vendor]
          ])
          .put(executeOrderFailure(order, nft, 'No credits available', undefined, false))
          .dispatch(executeOrderRequest(order, nft, fingerprint, false, true))
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('and the order execution fails', () => {
    let vendor: Vendor<VendorName>
    let error: Error & { code?: ErrorCode }
    let errorMessage: string

    beforeEach(() => {
      vendor = VendorFactory.build(nft.vendor, undefined)
      errorMessage = 'The execution was reverted'
      error = new Error(errorMessage)
      error.code = ErrorCode.SALE_PRICE_TOO_LOW
    })

    it('should put the execute order failure with the error message and the error code', () => {
      return expectSaga(orderSaga, tradeService)
        .provide([
          [select(getIsCreditsEnabled), false],
          [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
          [select(getWallet), wallet],
          [call([VendorFactory, 'build'], nft.vendor, undefined), vendor],
          [call([vendor.orderService, 'execute'], wallet, nft, order, fingerprint), throwError(error)]
        ])
        .put(executeOrderFailure(order, nft, errorMessage, ErrorCode.SALE_PRICE_TOO_LOW))
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
        return expectSaga(orderSaga, tradeService)
          .provide([
            [select(getWallet), wallet],
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
            [select(getIsCreditsEnabled), false],
            [call([VendorFactory, 'build'], nft.vendor, undefined), vendor],
            [select(getRentalById, nft.openRentalId!), rentalListing],
            [call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED), Promise.resolve()],
            [call([vendor.orderService, 'execute'], wallet, nft, order, fingerprint), Promise.resolve(txHash)],
            [call(waitForTx, txHash), Promise.resolve()]
          ])
          .put(executeOrderTransactionSubmitted(order, nft, txHash))
          .put(executeOrderSuccess(txHash, nft))
          .dispatch(executeOrderRequest(order, nft, fingerprint))
          .run({ silenceTimeout: true })
      })
    })

    describe("and the NFT doesn't have a rental", () => {
      beforeEach(() => {
        nft.openRentalId = null
      })

      it('should put the success action', () => {
        return expectSaga(orderSaga, tradeService)
          .provide([
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), true],
            [select(getIsCreditsEnabled), false],
            [call([VendorFactory, 'build'], nft.vendor, undefined), vendor],
            [select(getWallet), wallet],
            [call([vendor.orderService, 'execute'], wallet, nft, order, fingerprint), Promise.resolve(txHash)]
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
      return expectSaga(orderSaga, tradeService)
        .provide([[call([localStorage, 'getItem'], BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY), 'true']])
        .put(openTransak(nft))
        .dispatch(executeOrderWithCardRequest(nft))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(localStorage.setItem).not.toHaveBeenCalled()
        })
    })
  })

  describe('when the explanation modal is shown and the user closes it', () => {
    it('should not set nft in the local storage to show the modal again later', () => {
      return expectSaga(orderSaga, tradeService)
        .provide([[call([localStorage, 'getItem'], BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY), null]])
        .put(openModal('BuyWithCardExplanationModal', { asset: nft, order: undefined }))
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
      return expectSaga(orderSaga, tradeService)
        .provide([[call(buyAssetWithCard, nft, undefined), Promise.reject(new Error(errorMessage))]])
        .put(executeOrderWithCardFailure(errorMessage))
        .dispatch(executeOrderWithCardRequest(nft))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the set purchase action', () => {
  describe('when it is a MANA purchase', () => {
    it('should not put any new action', () => {
      return expectSaga(orderSaga, tradeService)
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
        return expectSaga(orderSaga, tradeService)
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
        return expectSaga(orderSaga, tradeService)
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
        return expectSaga(orderSaga, tradeService)
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
      describe('when the nft does not yet exist in the store', () => {
        it('should put the action signaling the fetch nft request', () => {
          return expectSaga(orderSaga, tradeService)
            .provide([[select(getNFTs), {}]])
            .put(fetchNFTRequest(contractAddress, tokenId!))
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

      describe('when the action of fetching the nft has been dispatched', () => {
        let errorMessage: string

        beforeEach(() => {
          errorMessage = 'The execution was reverted'
        })

        describe('when the fetch nft request fails', () => {
          it('should put an action signaling the failure of the execute order with card request', () => {
            return expectSaga(orderSaga, tradeService)
              .provide([
                [select(getNFTs), {}],
                [take(FETCH_NFT_FAILURE), { payload: { error: errorMessage } }]
              ])
              .put(fetchNFTRequest(contractAddress, tokenId!))
              .put(executeOrderWithCardFailure(errorMessage))
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

      describe('when the nft already exists in the store', () => {
        const nfts = { anNFTId: nft }

        it('should put an action signaling the success of the execute order with card request', () => {
          return expectSaga(orderSaga, tradeService)
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
