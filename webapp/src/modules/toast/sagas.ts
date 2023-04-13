import { all, takeEvery, put } from 'redux-saga/effects'
import { toastSaga as baseToastSaga } from 'decentraland-dapps/dist/modules/toast/sagas'
import {
  showToast,
  hideAllToasts
} from 'decentraland-dapps/dist/modules/toast/actions'
import { UPDATE_STORE_SUCCESS } from '../store/actions'
import {
  CLAIM_ASSET_SUCCESS,
  REMOVE_RENTAL_SUCCESS,
  UpsertRentalSuccessAction,
  UPSERT_RENTAL_SUCCESS
} from '../rental/actions'
import {
  BUY_ITEM_WITH_CARD_FAILURE,
  FETCH_ITEMS_FAILURE,
  FetchItemsFailureAction
} from '../item/actions'
import {
  EXECUTE_ORDER_WITH_CARD_FAILURE,
  EXECUTE_ORDER_FAILURE
} from '../order/actions'
import {
  getBuyNFTWithCardErrorToast,
  getExcecuteOrderFailureToast,
  getFetchAssetsFailureToast,
  getLandClaimedBackSuccessToast,
  getListingRemoveSuccessToast,
  getPickItemAsFavoriteFailureToast,
  getPickItemAsFavoriteSuccessToast,
  getStoreUpdateSuccessToast,
  getUnpickItemAsFavoriteFailureToast,
  getUnpickItemAsFavoriteSuccessToast,
  getUpsertRentalSuccessToast
} from './toasts'
import {
  PickItemAsFavoriteFailureAction,
  PickItemAsFavoriteSuccessAction,
  PICK_ITEM_AS_FAVORITE_FAILURE,
  PICK_ITEM_AS_FAVORITE_SUCCESS,
  UnpickItemAsFavoriteFailureAction,
  UnpickItemAsFavoriteSuccessAction,
  UNPICK_ITEM_AS_FAVORITE_FAILURE,
  UNPICK_ITEM_AS_FAVORITE_SUCCESS
} from '../favorites/actions'
import { toastDispatchableActionsChannel } from './utils'
import { DispatchableFromToastActions } from './types'
import { FETCH_NFTS_FAILURE, FetchNFTsFailureAction } from '../nft/actions'

export function* toastSaga() {
  yield all([baseToastSaga(), customToastSaga()])
}

function* customToastSaga() {
  yield all([successToastSagas()])
}

function* successToastSagas() {
  yield takeEvery(UPDATE_STORE_SUCCESS, handleStoreUpdateSuccess)
  yield takeEvery(REMOVE_RENTAL_SUCCESS, handleRemoveRentalSuccess)
  yield takeEvery(CLAIM_ASSET_SUCCESS, handleClaimLandBackSuccess)
  yield takeEvery(UPSERT_RENTAL_SUCCESS, handleUpsertRentalSuccess)
  yield takeEvery(BUY_ITEM_WITH_CARD_FAILURE, handleBuyNFTWithCardFailure)
  yield takeEvery(EXECUTE_ORDER_WITH_CARD_FAILURE, handleBuyNFTWithCardFailure)
  yield takeEvery(EXECUTE_ORDER_FAILURE, handleExcecuteOrderFailure)
  yield takeEvery(FETCH_ITEMS_FAILURE, handleFetchAssetsFailure)
  yield takeEvery(FETCH_NFTS_FAILURE, handleFetchAssetsFailure)
  yield takeEvery(
    PICK_ITEM_AS_FAVORITE_SUCCESS,
    handlePickItemAsFavoriteSuccess
  )
  yield takeEvery(
    PICK_ITEM_AS_FAVORITE_FAILURE,
    handlePickItemAsFavoriteFailure
  )
  yield takeEvery(
    UNPICK_ITEM_AS_FAVORITE_SUCCESS,
    handleUnpickItemAsFavoriteSuccess
  )
  yield takeEvery(
    UNPICK_ITEM_AS_FAVORITE_FAILURE,
    handleUnpickItemAsFavoriteFailure
  )
  yield takeEvery(
    toastDispatchableActionsChannel,
    handleToastTryAgainActionChannel
  )

  function* handleToastTryAgainActionChannel(
    action: DispatchableFromToastActions
  ) {
    yield put(action)
    yield put(hideAllToasts())
  }
}

function* handleStoreUpdateSuccess() {
  yield put(showToast(getStoreUpdateSuccessToast()))
}

function* handleRemoveRentalSuccess() {
  yield put(showToast(getListingRemoveSuccessToast()))
}

function* handleClaimLandBackSuccess() {
  yield put(showToast(getLandClaimedBackSuccessToast()))
}

function* handleUpsertRentalSuccess(action: UpsertRentalSuccessAction) {
  yield put(
    showToast(
      getUpsertRentalSuccessToast(
        action.payload.nft,
        action.payload.operationType
      )
    )
  )
}

function* handleBuyNFTWithCardFailure() {
  yield put(showToast(getBuyNFTWithCardErrorToast(), 'bottom center'))
}

function* handleExcecuteOrderFailure() {
  yield put(showToast(getExcecuteOrderFailureToast(), 'bottom center'))
}

function* handlePickItemAsFavoriteSuccess(
  action: PickItemAsFavoriteSuccessAction
) {
  const { item } = action.payload
  yield put(showToast(getPickItemAsFavoriteSuccessToast(item), 'bottom center'))
}

function* handlePickItemAsFavoriteFailure(
  action: PickItemAsFavoriteFailureAction
) {
  const { item } = action.payload
  yield put(showToast(getPickItemAsFavoriteFailureToast(item), 'bottom center'))
}

function* handleUnpickItemAsFavoriteSuccess(
  action: UnpickItemAsFavoriteSuccessAction
) {
  const { item } = action.payload
  yield put(
    showToast(getUnpickItemAsFavoriteSuccessToast(item), 'bottom center')
  )
}

function* handleUnpickItemAsFavoriteFailure(
  action: UnpickItemAsFavoriteFailureAction
) {
  const { item } = action.payload
  yield put(
    showToast(getUnpickItemAsFavoriteFailureToast(item), 'bottom center')
  )
}

function* handleFetchAssetsFailure(
  action: FetchItemsFailureAction | FetchNFTsFailureAction
) {
  const { error } = action.payload
  yield put(showToast(getFetchAssetsFailureToast(error), 'bottom right'))
}
