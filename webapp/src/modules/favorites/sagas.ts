import { call, put, race, select, take, takeEvery } from 'redux-saga/effects'
import { Item } from '@dcl/schemas'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_FAILURE,
  CONNECT_WALLET_SUCCESS
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { ItemBrowseOptions } from '../item/types'
import {
  closeModal,
  CloseModalAction,
  CLOSE_MODAL,
  openModal
} from '../modal/actions'
import {
  FavoritesAPI,
  MARKETPLACE_FAVORITES_SERVER_URL
} from '../vendor/decentraland/favorites/api'
import { retryParams } from '../vendor/decentraland/utils'
import { getAddress } from '../wallet/selectors'
import { ItemAPI } from '../vendor/decentraland/item/api'
import { NFT_SERVER_URL } from '../vendor/decentraland'
import {
  cancelPickItemAsFavorite,
  fetchFavoritedItemsFailure,
  FetchFavoritedItemsRequestAction,
  fetchFavoritedItemsSuccess,
  FETCH_FAVORITED_ITEMS_REQUEST,
  pickItemAsFavoriteFailure,
  PickItemAsFavoriteRequestAction,
  pickItemAsFavoriteSuccess,
  PICK_ITEM_AS_FAVORITE_REQUEST,
  undoUnpickingItemAsFavoriteFailure,
  UndoUnpickingItemAsFavoriteRequestAction,
  undoUnpickingItemAsFavoriteSuccess,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST,
  unpickItemAsFavoriteFailure,
  UnpickItemAsFavoriteRequestAction,
  unpickItemAsFavoriteSuccess,
  UNPICK_ITEM_AS_FAVORITE_REQUEST
} from './actions'
import { getListId } from './selectors'
import { FavoritedItems } from './types'

export function* favoritesSaga(getIdentity: () => AuthIdentity | undefined) {
  const itemAPI = new ItemAPI(NFT_SERVER_URL, {
    retries: retryParams.attempts,
    retryDelay: retryParams.delay,
    identity: getIdentity
  })

  const favoritesAPI = new FavoritesAPI(MARKETPLACE_FAVORITES_SERVER_URL, {
    retries: retryParams.attempts,
    retryDelay: retryParams.delay,
    identity: getIdentity
  })

  yield takeEvery(
    PICK_ITEM_AS_FAVORITE_REQUEST,
    handlePickItemAsFavoriteRequest
  )
  yield takeEvery(
    UNPICK_ITEM_AS_FAVORITE_REQUEST,
    handleUnpickItemAsFavoriteRequest
  )
  yield takeEvery(
    UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST,
    handleUndoUnpickingItemAsFavoriteRequest
  )
  yield takeEvery(
    FETCH_FAVORITED_ITEMS_REQUEST,
    handleFetchFavoritedItemsRequest
  )

  function* handlePickItemAsFavoriteRequest(
    action: PickItemAsFavoriteRequestAction
  ) {
    const { item } = action.payload

    try {
      const address: string = yield select(getAddress)

      if (!address) {
        yield put(openModal('LoginModal'))

        const {
          success,
          close
        }: {
          success: ConnectWalletSuccessAction
          failure: ConnectWalletSuccessAction
          close: CloseModalAction
        } = yield race({
          success: take(CONNECT_WALLET_SUCCESS),
          failure: take(CONNECT_WALLET_FAILURE),
          close: take(CLOSE_MODAL)
        })

        if (close) {
          yield put(cancelPickItemAsFavorite())
          return
        }

        if (success) yield put(closeModal('LoginModal'))
      }

      yield call([favoritesAPI, 'pickItemAsFavorite'], item.id)
      yield put(pickItemAsFavoriteSuccess(item))
    } catch (error) {
      yield put(pickItemAsFavoriteFailure(item, (error as Error).message))
    }
  }

  function* handleUnpickItemAsFavoriteRequest(
    action: UnpickItemAsFavoriteRequestAction
  ) {
    const { item } = action.payload
    try {
      yield call([favoritesAPI, 'unpickItemAsFavorite'], item.id)

      yield put(unpickItemAsFavoriteSuccess(item))
    } catch (error) {
      yield put(unpickItemAsFavoriteFailure(item, (error as Error).message))
    }
  }

  function* handleUndoUnpickingItemAsFavoriteRequest(
    action: UndoUnpickingItemAsFavoriteRequestAction
  ) {
    const { item } = action.payload
    try {
      yield call([favoritesAPI, 'pickItemAsFavorite'], item.id)

      yield put(undoUnpickingItemAsFavoriteSuccess(item))
    } catch (error) {
      yield put(
        undoUnpickingItemAsFavoriteFailure(item, (error as Error).message)
      )
    }
  }

  function* handleFetchFavoritedItemsRequest(
    action: FetchFavoritedItemsRequestAction
  ) {
    const { filters } = action.payload.options
    try {
      let items: Item[] = []
      const listId: string = yield select(getListId)
      const {
        results,
        total
      }: { results: FavoritedItems; total: number } = yield call(
        [favoritesAPI, 'getPicksByList'],
        listId,
        filters
      )
      const createdAt = Object.fromEntries(
        results.map(favoritedItem => [
          favoritedItem.itemId,
          favoritedItem.createdAt
        ])
      )
      const options: ItemBrowseOptions = {
        ...action.payload.options,
        filters: {
          first: results.length,
          ids: results.map(({ itemId }) => itemId)
        }
      }

      if (results.length > 0) {
        const result: { data: Item[] } = yield call(
          [itemAPI, 'get'],
          options.filters
        )
        items = result.data
      }

      yield put(
        fetchFavoritedItemsSuccess(
          items,
          createdAt,
          total,
          options,
          Date.now(),
          action.payload.forceLoadMore
        )
      )
    } catch (error) {
      yield put(fetchFavoritedItemsFailure((error as Error).message))
    }
  }
}
