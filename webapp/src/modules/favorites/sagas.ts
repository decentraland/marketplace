import { AuthIdentity } from 'decentraland-crypto-fetch'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_FAILURE,
  CONNECT_WALLET_SUCCESS
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { call, put, race, select, take, takeEvery } from 'redux-saga/effects'
import { getIdentity } from '../identity/utils'
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
