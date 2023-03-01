import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { call, select, take } from 'redux-saga/effects'
import { ChainId, Item, Network } from '@dcl/schemas'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { setPurchase } from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import {
  ManaPurchase,
  NFTPurchase,
  PurchaseStatus
} from 'decentraland-dapps/dist/modules/gateway/types'
import { NetworkGatewayType } from 'decentraland-ui'
import { getWallet } from '../wallet/selectors'
import { View } from '../ui/types'
import { itemAPI } from '../vendor/decentraland/item/api'
import { closeModal, openModal } from '../modal/actions'
import {
  buyAssetWithCard,
  BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
} from '../asset/utils'
import {
  buyItemRequest,
  buyItemFailure,
  buyItemSuccess,
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchItemsFailure,
  fetchItemSuccess,
  fetchItemRequest,
  fetchItemFailure,
  fetchTrendingItemsSuccess,
  fetchTrendingItemsFailure,
  fetchTrendingItemsRequest,
  buyItemWithCardRequest,
  buyItemWithCardFailure,
  buyItemWithCardSuccess,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEM_FAILURE,
  FETCH_ITEMS_FAILURE
} from './actions'
import { itemSaga } from './sagas'
import {
  getData as getItems,
  getLoading as getItemLoading,
  isFetchingItem
} from './selectors'
import { getItem } from './utils'

const item = {
  itemId: 'anItemId',
  price: '324234',
  chainId: ChainId.MATIC_MAINNET,
  contractAddress: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
} as Item

const wallet = {
  address: '0x32be343b94f860124dc4fee278fdcbd38c102d88'
}

const txHash =
  '0x9fc518261399c1bd236997706347f8b117a061cef5518073b1c3eefd5efbff84'

const anError = new Error('An error occured')

const itemBrowseOptions = {
  view: View.MARKET,
  page: 0,
  filters: {}
}

const manaPurchase: ManaPurchase = {
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

const nftPurchase: NFTPurchase = {
  ...manaPurchase,
  nft: {
    contractAddress: 'contractAddress',
    itemId: 'anId',
    tokenId: undefined,
    tradeType: TradeType.PRIMARY,
    cryptoAmount: 10
  }
}

describe('when handling the buy items request action', () => {
  describe("when there's no wallet loaded in the state", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga)
        .provide([[select(getWallet), null]])
        .put(buyItemFailure('A defined wallet is required to buy an item'))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('when sending the meta transaction fails', () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga)
        .provide([
          [select(getWallet), wallet],
          [matchers.call.fn(sendTransaction), Promise.reject(anError)]
        ])
        .put(buyItemFailure(anError.message))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the meta transaction is sent succesfully', () => {
    it('should send a meta transaction to the collection store contract living in the chain provided by the item and dispatch the success action', () => {
      return expectSaga(itemSaga)
        .provide([
          [select(getWallet), wallet],
          [matchers.call.fn(sendTransaction), Promise.resolve(txHash)]
        ])
        .put(buyItemSuccess(item.chainId, txHash, item))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the buy items with card action', () => {
  beforeEach(() => {
    jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when the explanation modal has already been shown', () => {
    it('should open Transak widget', () => {
      return expectSaga(itemSaga)
        .provide([
          [
            call(
              [localStorage, 'getItem'],
              BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
            ),
            null
          ]
        ])
        .put(openModal('BuyWithCardExplanationModal', { asset: item }))
        .dispatch(buyItemWithCardRequest(item))
        .dispatch(closeModal('BuyWithCardExplanationModal'))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(localStorage.setItem).not.toHaveBeenCalled()
        })
    })
  })

  describe('when the explanation modal is shown and the user closes it', () => {
    it('should not set the item in the local storage to show the modal again later', () => {
      return expectSaga(itemSaga)
        .provide([
          [
            call(
              [localStorage, 'getItem'],
              BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
            ),
            null
          ]
        ])
        .put(openModal('BuyWithCardExplanationModal', { asset: item }))
        .dispatch(buyItemWithCardRequest(item))
        .dispatch(closeModal('BuyWithCardExplanationModal'))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(localStorage.setItem).not.toHaveBeenCalled()
        })
    })
  })

  describe('when opening Transak Widget fails', () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga)
        .provide([[call(buyAssetWithCard, item), Promise.reject(anError)]])
        .put(buyItemWithCardFailure(anError.message))
        .dispatch(buyItemWithCardRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('when Transak widget is opened succesfully', () => {
    it('should dispatch the success action', () => {
      return expectSaga(itemSaga)
        .provide([[call(buyAssetWithCard, item), Promise.resolve()]])
        .dispatch(buyItemWithCardRequest(item))
        .run({ silenceTimeout: true })
        .then(({ effects }) => {
          expect(effects.put).toBeUndefined()
        })
    })
  })
})

describe('when handling the set purchase action', () => {
  describe('when it is a MANA purchase', () => {
    it('should not put any new action', () => {
      return expectSaga(itemSaga)
        .dispatch(setPurchase(manaPurchase))
        .run({ silenceTimeout: true })
        .then(({ effects }) => {
          expect(effects.put).toBeUndefined()
        })
    })
  })

  describe('when it is an NFT purchase', () => {
    describe('when it is a secondary market purchase', () => {
      it('should not put any new action', () => {
        return expectSaga(itemSaga)
          .dispatch(
            setPurchase({
              ...nftPurchase,
              nft: {
                ...nftPurchase.nft,
                tokenId: nftPurchase.nft.itemId,
                tradeType: TradeType.SECONDARY,
                itemId: undefined
              }
            })
          )
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('when the purchase is incomplete', () => {
      it('should not put any new action', () => {
        return expectSaga(itemSaga)
          .dispatch(setPurchase(nftPurchase))
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('when it is complete without a txHash', () => {
      it('should not put any new action', () => {
        return expectSaga(itemSaga)
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

    describe('when it is complete and it has a txHash', () => {
      const { contractAddress, itemId } = nftPurchase.nft

      describe('when the item does not yet exist in the store', () => {
        it('should put the action signaling the fetch item request', () => {
          return expectSaga(itemSaga)
            .provide([[select(getItems), {}]])
            .put(fetchItemRequest(contractAddress, itemId!))
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

      describe('when the action of fetching the item has been dispatched', () => {
        describe('when the fetch item request fails', () => {
          it('should put an action signaling the failure of the buy item with card request', () => {
            return expectSaga(itemSaga)
              .provide([
                [select(getItems), {}],
                [
                  take(FETCH_ITEM_FAILURE),
                  { payload: { error: anError.message } }
                ]
              ])
              .put(fetchItemRequest(contractAddress, itemId!))
              .put(buyItemWithCardFailure(anError.message))
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

      describe('when the item already exists in the store', () => {
        const items = { anItemId: item }

        it('should put an action signaling the success of the buy item with card request', () => {
          return expectSaga(itemSaga)
            .provide([
              [select(getItems), items],
              [call(getItem, contractAddress, itemId, items), item]
            ])
            .put(
              buyItemWithCardSuccess(item.chainId, txHash, item, {
                ...nftPurchase,
                status: PurchaseStatus.COMPLETE
              })
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

describe('when handling the fetch items request action', () => {
  describe('when the request is successful', () => {
    let dateNowSpy: jest.SpyInstance
    const nowTimestamp = 1487076708000
    const fetchResult = { data: [item], total: 1 }

    beforeEach(() => {
      dateNowSpy = jest
        .spyOn(Date, 'now')
        .mockImplementation(() => nowTimestamp)
    })

    afterEach(() => {
      dateNowSpy.mockRestore()
    })

    it('should dispatch a successful action with the fetched items', () => {
      return expectSaga(itemSaga)
        .provide([
          [call([itemAPI, 'fetch'], itemBrowseOptions.filters), fetchResult]
        ])
        .put(
          fetchItemsSuccess(
            fetchResult.data,
            fetchResult.total,
            itemBrowseOptions,
            nowTimestamp
          )
        )
        .dispatch(fetchItemsRequest(itemBrowseOptions))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the request fails', () => {
    it('should dispatching a failing action with the error and the options', () => {
      return expectSaga(itemSaga)
        .provide([
          [
            call([itemAPI, 'fetch'], itemBrowseOptions.filters),
            Promise.reject(anError)
          ]
        ])
        .put(fetchItemsFailure(anError.message, itemBrowseOptions))
        .dispatch(fetchItemsRequest(itemBrowseOptions))
        .run({ silenceTimeout: true })
    })
  })

  describe('when handling the fetch item request action', () => {
    describe('when the request is successful', () => {
      it('should dispatch a successful action with the fetched items', () => {
        return expectSaga(itemSaga)
          .provide([
            [
              call([itemAPI, 'fetchOne'], item.contractAddress, item.itemId),
              item
            ]
          ])
          .put(fetchItemSuccess(item))
          .dispatch(fetchItemRequest(item.contractAddress, item.itemId))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request fails', () => {
      it('should dispatching a failing action with the contract address, the token id and the error message', () => {
        return expectSaga(itemSaga)
          .provide([
            [
              call([itemAPI, 'fetchOne'], item.contractAddress, item.itemId),
              Promise.reject(anError)
            ]
          ])
          .put(
            fetchItemFailure(item.contractAddress, item.itemId, anError.message)
          )
          .dispatch(fetchItemRequest(item.contractAddress, item.itemId))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the fetch trending items request action', () => {
  describe('when the request is successful', () => {
    let dateNowSpy: jest.SpyInstance
    const nowTimestamp = 1487076708000
    const fetchResult = { data: [item], total: 1 }

    beforeEach(() => {
      dateNowSpy = jest
        .spyOn(Date, 'now')
        .mockImplementation(() => nowTimestamp)
    })

    afterEach(() => {
      dateNowSpy.mockRestore()
    })

    it('should dispatch a successful action with the fetched trending items', () => {
      return expectSaga(itemSaga)
        .provide([[call([itemAPI, 'fetchTrendings'], undefined), fetchResult]])
        .put(fetchTrendingItemsSuccess(fetchResult.data))
        .dispatch(fetchTrendingItemsRequest())
        .run({ silenceTimeout: true })
    })
  })

  describe('when the request fails', () => {
    it('should dispatching a failing action with the error and the options', () => {
      return expectSaga(itemSaga)
        .provide([
          [
            call([itemAPI, 'fetchTrendings'], undefined),
            Promise.reject(anError)
          ]
        ])
        .put(fetchTrendingItemsFailure(anError.message))
        .dispatch(fetchTrendingItemsRequest())
        .run({ silenceTimeout: true })
    })
  })
})
