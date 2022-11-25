import { all, takeEvery, put } from 'redux-saga/effects'
import { toastSaga as baseToastSaga } from 'decentraland-dapps/dist/modules/toast/sagas'
import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import { UPDATE_STORE_SUCCESS } from '../store/actions'
import {
  CLAIM_ASSET_SUCCESS,
  REMOVE_RENTAL_SUCCESS,
  UpsertRentalSuccessAction,
  UPSERT_RENTAL_SUCCESS
} from '../rental/actions'
import {
  getLandClaimedBackSuccessToast,
  getListingRemoveSuccessToast,
  getStoreUpdateSuccessToast,
  getUpsertRentalSuccessToast
} from './toasts'

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
