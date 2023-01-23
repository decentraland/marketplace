import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { ChainId, Item } from '@dcl/schemas'
import { call, select } from 'redux-saga/effects'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
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
  buyItemWithCard
} from './actions'
import { getWallet } from '../wallet/selectors'
import { View } from '../ui/types'
import { itemAPI } from '../vendor/decentraland/item/api'
import { closeModal, openModal } from '../modal/actions'
import { itemSaga } from './sagas'
import { BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY } from '../asset/utils'

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
        .dispatch(buyItemWithCard(item))
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
        .dispatch(buyItemWithCard(item))
        .dispatch(closeModal('BuyWithCardExplanationModal'))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(localStorage.setItem).not.toHaveBeenCalled()
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
