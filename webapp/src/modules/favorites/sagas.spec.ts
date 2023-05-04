import { call, select, take } from 'redux-saga/effects'
import * as matchers from 'redux-saga-test-plan/matchers'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { Item } from '@dcl/schemas'
import { CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import { closeModal, CLOSE_MODAL, openModal } from '../modal/actions'
import { FavoritesAPI } from '../vendor/decentraland/favorites/api'
import { getAddress } from '../wallet/selectors'
import { ItemBrowseOptions } from '../item/types'
import { View } from '../ui/types'
import { getIdentity as getAccountIdentity } from '../identity/utils'
import { ItemAPI } from '../vendor/decentraland/item/api'
import { fetchItemsRequest, fetchItemsSuccess } from '../item/actions'
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
import { FavoritedItems } from './types'

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
              [call(getAccountIdentity), Promise.resolve()],
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

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getAddress), address],
          [call(getAccountIdentity), Promise.reject(error)]
        ])
        .put(pickItemAsFavoriteFailure(item, error.message))
        .dispatch(pickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getAddress), address],
          [call(getAccountIdentity), Promise.resolve()],
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
          [call(getAccountIdentity), Promise.resolve()],
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
  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[call(getAccountIdentity), Promise.reject(error)]])
        .put(unpickItemAsFavoriteFailure(item, error.message))
        .dispatch(unpickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
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
          ],
          [call(getAccountIdentity), Promise.resolve()],
          [matchers.put(unpickItemAsFavoriteSuccess(item)), undefined]
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
  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[call(getAccountIdentity), Promise.reject(error)]])
        .put(undoUnpickingItemAsFavoriteFailure(item, error.message))
        .dispatch(undoUnpickingItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
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
          ],
          [call(getAccountIdentity), Promise.resolve()]
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

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getListId), listId],
          [call(getAccountIdentity), Promise.reject(error)]
        ])
        .put(fetchFavoritedItemsFailure(error.message))
        .dispatch(fetchFavoritedItemsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getListId), listId],
          [call(getAccountIdentity), Promise.resolve()],
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
    let favoritedItemIds: FavoritedItems
    let createdAt: Record<string, number>
    let total: number

    describe("and there's more than favorited item", () => {
      beforeEach(() => {
        favoritedItemIds = [{ itemId: item.id, createdAt: Date.now() }]
        createdAt = { [item.id]: favoritedItemIds[0].createdAt }
        total = 1
      })

      describe('and the call to the items api fails', () => {
        it('should dispatch an action signaling the failure of the handled action', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [select(getListId), listId],
              [call(getAccountIdentity), Promise.resolve()],
              [
                matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
                Promise.resolve({ results: favoritedItemIds, total })
              ],
              [matchers.call.fn(ItemAPI.prototype.get), Promise.reject(error)]
            ])
            .call.like({
              fn: ItemAPI.prototype.get,
              args: [
                {
                  ...options.filters,
                  first: 1,
                  ids: [favoritedItemIds[0].itemId]
                }
              ]
            })
            .put(fetchFavoritedItemsFailure(error.message))
            .dispatch(fetchFavoritedItemsRequest(options))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the call to the items api succeeds', () => {
        let currentTimestamp: number
        beforeEach(() => {
          total = 0
          currentTimestamp = Date.now()
          jest.spyOn(Date, 'now').mockReturnValueOnce(currentTimestamp)
        })

        it('should dispatch an action signaling the success of the handled action and the request of the retrieved items', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [select(getListId), listId],
              [call(getAccountIdentity), Promise.resolve()],
              [
                matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
                Promise.resolve({ results: favoritedItemIds, total })
              ],
              [
                matchers.call.fn(ItemAPI.prototype.get),
                Promise.resolve({ data: [item] })
              ]
            ])
            .call.like({
              fn: FavoritesAPI.prototype.getPicksByList,
              args: [listId, options.filters]
            })
            .call.like({
              fn: ItemAPI.prototype.get,
              args: [
                {
                  ...options.filters,
                  first: 1,
                  ids: [favoritedItemIds[0].itemId]
                }
              ]
            })
            .put(
              fetchFavoritedItemsSuccess(
                [item],
                createdAt,
                total,
                { ...options, filters: { ids: [item.id], first: 1 } },
                currentTimestamp
              )
            )
            .dispatch(fetchFavoritedItemsRequest(options))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('and there are no favorited items', () => {
      let currentTimestamp: number

      beforeEach(() => {
        favoritedItemIds = []
        total = 0
        currentTimestamp = Date.now()
        jest.spyOn(Date, 'now').mockReturnValueOnce(currentTimestamp)
      })

      it('should dispatch an action signaling the success of the handled action', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [select(getListId), listId],
            [call(getAccountIdentity), Promise.resolve()],
            [
              matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
              { results: favoritedItemIds, total }
            ]
          ])
          .call.like({
            fn: FavoritesAPI.prototype.getPicksByList,
            args: [listId, options.filters]
          })
          .not.call.like({
            fn: ItemAPI.prototype.get,
            args: [options.filters]
          })
          .put(
            fetchFavoritedItemsSuccess(
              [],
              {},
              total,
              {
                ...options,
                filters: { first: favoritedItemIds.length, ids: [] }
              },
              currentTimestamp
            )
          )
          .dispatch(fetchFavoritedItemsRequest(options))
          .run({ silenceTimeout: true })
      })
    })
  })
})
