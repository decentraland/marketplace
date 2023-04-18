import { call, select, take } from 'redux-saga/effects'
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
import { fetchItemsRequest } from '../item/actions'
import { FavoritedItemIds } from './types'

jest.mock('../vendor/decentraland/favorites/api')

let item: Item
let address: string
let error: Error
let favoritesAPI: FavoritesAPI

const getIdentity = () => undefined

beforeEach(() => {
  error = new Error('error')
  item = { id: 'anAddress-itemId', itemId: 'itemId' } as Item
  address = '0xb549b2442b2bd0a53795bc5cdcbfe0caf7aca9f8'
  favoritesAPI = new FavoritesAPI(MARKETPLACE_FAVORITES_SERVER_URL, {
    identity: getIdentity
  })
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
              [call([favoritesAPI, 'pickItemAsFavorite'], item.id), undefined]
            ])
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
    beforeEach(() => {
      jest
        .spyOn(FavoritesAPI.prototype, 'pickItemAsFavorite')
        .mockRejectedValue(error)
    })

    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[select(getAddress), address]])
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
          [call([favoritesAPI, 'pickItemAsFavorite'], item.id), undefined]
        ])
        .put(pickItemAsFavoriteSuccess(item))
        .dispatch(pickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for unpicking a favorite item', () => {
  describe('and the call to the favorites api fails', () => {
    beforeEach(() => {
      jest
        .spyOn(FavoritesAPI.prototype, 'unpickItemAsFavorite')
        .mockRejectedValue(error)
    })

    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .put(unpickItemAsFavoriteFailure(item, error.message))
        .dispatch(unpickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call([favoritesAPI, 'unpickItemAsFavorite'], item.id), undefined]
        ])
        .put(unpickItemAsFavoriteSuccess(item))
        .dispatch(unpickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for undo unpicking a favorite item', () => {
  describe('and the call to the favorites api fails', () => {
    beforeEach(() => {
      jest
        .spyOn(FavoritesAPI.prototype, 'pickItemAsFavorite')
        .mockRejectedValue(error)
    })

    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .put(undoUnpickingItemAsFavoriteFailure(item, error.message))
        .dispatch(undoUnpickingItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call([favoritesAPI, 'pickItemAsFavorite'], item.id), undefined]
        ])
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
    beforeEach(() => {
      jest
        .spyOn(FavoritesAPI.prototype, 'getPicksByList')
        .mockRejectedValue(error)
    })

    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[select(getListId), listId]])
        .put(fetchFavoritedItemsFailure(error.message))
        .dispatch(fetchFavoritedItemsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    let favoritedItemIds: FavoritedItemIds
    let total: number

    beforeEach(() => {
      favoritedItemIds = [{ itemId: item.id }]
      total = 1
      jest.spyOn(FavoritesAPI.prototype, 'getPicksByList').mockResolvedValue({
        results: favoritedItemIds,
        total
      })
    })

    it('should dispatch an action signaling the success of the handled action and the request of the retrieved items', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[select(getListId), listId]])
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
  })
})
