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
  FETCH_ITEMS_CANCELLED_ERROR_MESSAGE,
  FETCH_ITEMS_FAILURE,
  FetchItemsFailureAction
} from '../item/actions'
import {
  EXECUTE_ORDER_WITH_CARD_FAILURE,
  EXECUTE_ORDER_FAILURE,
  ExecuteOrderFailureAction
} from '../order/actions'
import {
  getBulkPickItemFailureToast,
  getBulkPickItemSuccessToast,
  getBuyNFTWithCardErrorToast,
  getDeleteListFailureToast,
  getDeleteListSuccessToast,
  getExecuteOrderFailureToast,
  getFetchAssetsFailureToast,
  getLandClaimedBackSuccessToast,
  getListingRemoveSuccessToast,
  getStoreUpdateSuccessToast,
  getUpdateListSuccessToast,
  getUpsertRentalSuccessToast
} from './toasts'
import {
  DeleteListSuccessAction,
  DELETE_LIST_SUCCESS,
  DELETE_LIST_FAILURE,
  DeleteListFailureAction,
  BULK_PICK_SUCCESS,
  BulkPickUnpickSuccessAction,
  BulkPickUnpickFailureAction,
  BULK_PICK_FAILURE,
  UpdateListSuccessAction,
  UPDATE_LIST_SUCCESS
} from '../favorites/actions'
import { FETCH_NFTS_FAILURE, FetchNFTsFailureAction } from '../nft/actions'
import { toastDispatchableActionsChannel } from './utils'
import { DispatchableFromToastActions } from './types'

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
  yield takeEvery(UPDATE_LIST_SUCCESS, handleUpdateListSuccess)
  yield takeEvery(DELETE_LIST_SUCCESS, handleDeleteListSuccess)
  yield takeEvery(DELETE_LIST_FAILURE, handleDeleteListFailure)
  yield takeEvery(BUY_ITEM_WITH_CARD_FAILURE, handleBuyNFTWithCardFailure)
  yield takeEvery(EXECUTE_ORDER_WITH_CARD_FAILURE, handleBuyNFTWithCardFailure)
  yield takeEvery(EXECUTE_ORDER_FAILURE, handleExecuteOrderFailure)
  yield takeEvery(FETCH_ITEMS_FAILURE, handleFetchAssetsFailure)
  yield takeEvery(FETCH_NFTS_FAILURE, handleFetchAssetsFailure)
  yield takeEvery(
    toastDispatchableActionsChannel,
    handleToastTryAgainActionChannel
  )
  yield takeEvery(BULK_PICK_SUCCESS, handleBulkPickUnpickSuccess)
  yield takeEvery(BULK_PICK_FAILURE, handleBulkPickUnpickFailure)

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

function* handleUpdateListSuccess(action: UpdateListSuccessAction) {
  yield put(
    showToast(getUpdateListSuccessToast(action.payload.list), 'bottom center')
  )
}

function* handleDeleteListSuccess(action: DeleteListSuccessAction) {
  yield put(
    showToast(getDeleteListSuccessToast(action.payload.list), 'bottom center')
  )
}

function* handleDeleteListFailure(action: DeleteListFailureAction) {
  yield put(
    showToast(getDeleteListFailureToast(action.payload.list), 'bottom center')
  )
}

function* handleBuyNFTWithCardFailure() {
  yield put(showToast(getBuyNFTWithCardErrorToast(), 'bottom center'))
}

function* handleExecuteOrderFailure(action: ExecuteOrderFailureAction) {
  const { silent } = action.payload
  if (!silent) {
    yield put(showToast(getExecuteOrderFailureToast(), 'bottom center'))
  }
}

function* handleFetchAssetsFailure(
  action: FetchItemsFailureAction | FetchNFTsFailureAction
) {
  const { error } = action.payload
  if (error !== FETCH_ITEMS_CANCELLED_ERROR_MESSAGE) {
    yield put(showToast(getFetchAssetsFailureToast(error), 'bottom right'))
  }
}

function* handleBulkPickUnpickSuccess(action: BulkPickUnpickSuccessAction) {
  const { item, pickedFor, unpickedFrom } = action.payload
  yield put(hideAllToasts())
  yield put(
    showToast(
      getBulkPickItemSuccessToast(item, pickedFor, unpickedFrom),
      'bottom center'
    )
  )
}

function* handleBulkPickUnpickFailure(action: BulkPickUnpickFailureAction) {
  const { item, pickedFor, unpickedFrom } = action.payload
  yield put(hideAllToasts())
  yield put(
    showToast(
      getBulkPickItemFailureToast(item, pickedFor, unpickedFrom),
      'bottom center'
    )
  )
}
