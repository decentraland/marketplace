import { AuthIdentity } from 'decentraland-crypto-fetch'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_FAILURE,
  CONNECT_WALLET_SUCCESS
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { call, put, race, select, take, takeEvery } from 'redux-saga/effects'
import { getIdentity } from '../identity/utils'
import { fetchItemsRequest } from '../item/actions'
import { ItemBrowseOptions } from '../item/types'
import {
  closeModal,
  CloseModalAction,
  CLOSE_MODAL,
  openModal
} from '../modal/actions'
import { favoritesAPI } from '../vendor/decentraland/favorites/api'
import { getAddress } from '../wallet/selectors'
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
import { FavoritedItemIds } from './types'

export function* favoritesSaga() {
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
}

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

    const identity: AuthIdentity = yield call(getIdentity)
    yield call([favoritesAPI, 'pickItemAsFavorite'], item.id, identity)
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
    const identity: AuthIdentity = yield call(getIdentity)
    yield call([favoritesAPI, 'unpickItemAsFavorite'], item.id, identity)

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
    const identity: AuthIdentity = yield call(getIdentity)
    yield call([favoritesAPI, 'pickItemAsFavorite'], item.id, identity)

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
  const { filters } = action.payload
  try {
    const identity: AuthIdentity = yield call(getIdentity)
    const listId: string = yield select(getListId)
    const {
      results,
      total
    }: { results: FavoritedItemIds; total: number } = yield call(
      [favoritesAPI, 'getPicksByList'],
      listId,
      filters,
      identity
    )

    const options: ItemBrowseOptions = {
      ...action.payload,
      filters: {
        first: results.length,
        ids: results.map(({ itemId }) => itemId)
      }
    }

    yield put(fetchItemsRequest(options))
    yield put(fetchFavoritedItemsSuccess(results, total))
  } catch (error) {
    yield put(fetchFavoritedItemsFailure((error as Error).message))
  }
}
