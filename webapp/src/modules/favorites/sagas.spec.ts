import { call, select, take } from 'redux-saga/effects'
import * as matchers from 'redux-saga-test-plan/matchers'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { Item } from '@dcl/schemas'
import { CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import { closeModal, CLOSE_MODAL, openModal } from '../modal/actions'
import {
  FavoritesAPI,
  MARKETPLACE_FAVORITES_SERVER_URL
} from '../vendor/decentraland/favorites/api'
import { getAddress } from '../wallet/selectors'
import { ItemBrowseOptions } from '../item/types'
import { View } from '../ui/types'
import {
  cancelPickItemAsFavorite,
  fetchFavoritedItemsFailure,
  fetchFavoritedItemsRequest,
  fetchFavoritedItemsSuccess,
  pickItemAsFavoriteFailure,
  pickItemAsFavoriteRequest,
  pickItemAsFavoriteSuccess,
  undoUnpickingItemAsFavoriteFailure,
  undoUnpickingItemAsFavoriteRequest,
  undoUnpickingItemAsFavoriteSuccess,
  unpickItemAsFavoriteFailure,
  unpickItemAsFavoriteRequest,
  unpickItemAsFavoriteSuccess
} from './actions'
import { favoritesSaga } from './sagas'
import { getListId } from './selectors'
import {
  FETCH_ITEMS_SUCCESS,
  fetchItemsRequest,
  fetchItemsSuccess
} from '../item/actions'
import { FavoritedItemIds } from './types'

let item: Item
let address: string
let error: Error

const getIdentity = () => undefined

beforeEach(() => {
  error = new Error('error')
  item = { id: 'anAddress-itemId', itemId: 'itemId' } as Item
  address = '0xb549b2442b2bd0a53795bc5cdcbfe0caf7aca9f8'
})

describe('when handling the request for picking an item as favorite', () => {
  describe('and getting the address fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[select(getAddress), throwError(error)]])
        .put(pickItemAsFavoriteFailure(item, error.message))
        .dispatch(pickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and getting the address succeeds', () => {
    describe('and the user is not connected', () => {
      describe('and the user succeeds to connect the wallet', () => {
        it('should close the login modal after the success', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [select(getAddress), undefined],
              [take(CONNECT_WALLET_SUCCESS), {}],
              [
                matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
                undefined
              ]
            ])
            .call.like({
              fn: FavoritesAPI.prototype.pickItemAsFavorite,
              args: [item.id]
            })
            .put(openModal('LoginModal'))
            .put(closeModal('LoginModal'))
            .put(pickItemAsFavoriteSuccess(item))
            .dispatch(pickItemAsFavoriteRequest(item))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the user closes the login modal', () => {
        it('should finish the saga', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [select(getAddress), undefined],
              [take(CLOSE_MODAL), {}]
            ])
            .put(openModal('LoginModal'))
            .put(cancelPickItemAsFavorite())
            .dispatch(pickItemAsFavoriteRequest(item))
            .run({ silenceTimeout: true })
            .then(({ effects }) => {
              expect(effects.put).toBeUndefined()
            })
        })
      })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getAddress), address],
          [
            matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.pickItemAsFavorite,
          args: [item.id]
        })
        .put(pickItemAsFavoriteFailure(item, error.message))
        .dispatch(pickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getAddress), address],
          [
            matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
            undefined
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.pickItemAsFavorite,
          args: [item.id]
        })
        .put(pickItemAsFavoriteSuccess(item))
        .dispatch(pickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for unpicking a favorite item', () => {
  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.unpickItemAsFavorite),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.unpickItemAsFavorite,
          args: [item.id]
        })
        .put(unpickItemAsFavoriteFailure(item, error.message))
        .dispatch(unpickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.unpickItemAsFavorite),
            undefined
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.unpickItemAsFavorite,
          args: [item.id]
        })
        .put(unpickItemAsFavoriteSuccess(item))
        .dispatch(unpickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for undo unpicking a favorite item', () => {
  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.pickItemAsFavorite,
          args: [item.id]
        })
        .put(undoUnpickingItemAsFavoriteFailure(item, error.message))
        .dispatch(undoUnpickingItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
            undefined
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.pickItemAsFavorite,
          args: [item.id]
        })
        .put(undoUnpickingItemAsFavoriteSuccess(item))
        .dispatch(undoUnpickingItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for fetching favorited items', () => {
  let options: ItemBrowseOptions
  let listId: string

  beforeEach(() => {
    options = {
      view: View.LISTS,
      page: 0
    }
    listId = 'listId'
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getListId), listId],
          [
            matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.getPicksByList,
          args: [listId, options.filters]
        })
        .put(fetchFavoritedItemsFailure(error.message))
        .dispatch(fetchFavoritedItemsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    let favoritedItemIds: FavoritedItemIds
    let total: number

    describe("and there's more than favorited item", () => {
      beforeEach(() => {
        favoritedItemIds = [{ itemId: item.id }]
        total = 1
      })

      it('should dispatch an action signaling the success of the handled action and the request of the retrieved items', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [select(getListId), listId],
            [
              matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
              { results: favoritedItemIds, total }
            ]
          ])
          .call.like({
            fn: FavoritesAPI.prototype.getPicksByList,
            args: [listId, options.filters]
          })
          .put(fetchFavoritedItemsSuccess(favoritedItemIds, total))
          .put(
            fetchItemsRequest({
              ...options,
              filters: { ...options.filters, ids: [item.id], first: 1 }
            })
          )
          .dispatch(fetchFavoritedItemsRequest(options))
          .run({ silenceTimeout: true })
      })

      describe('and there are no favorited items', () => {
        let currentTimestamp: number

        beforeEach(() => {
          favoritedItemIds = []
          total = 0
          currentTimestamp = Date.now()
          jest.spyOn(Date, 'now').mockReturnValueOnce(currentTimestamp)
        })

        it('should dispatch an action signaling the success of the handled action and the success the items request', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [select(getListId), listId],
              [
                matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
                { results: favoritedItemIds, total }
              ]
            ])
            .call.like({
              fn: FavoritesAPI.prototype.getPicksByList,
              args: [listId, options.filters]
            })
            .not.put(
              fetchItemsRequest({
                ...options,
                filters: { ids: [item.id], first: 1 }
              })
            )
            .put(
              fetchItemsSuccess(
                [],
                total,
                {
                  ...options,
                  filters: { first: total, ids: [] }
                },
                currentTimestamp
              )
            )
            .put(fetchFavoritedItemsSuccess(favoritedItemIds, total))
            .dispatch(fetchFavoritedItemsRequest(options))
            .run({ silenceTimeout: true })
        })
      })
    })
  })
})
