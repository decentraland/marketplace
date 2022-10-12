import { LOCATION_CHANGE } from 'connected-react-router'
import { delay, put, select, takeEvery } from 'redux-saga/effects'
import { ModalState } from 'decentraland-dapps/dist/modules/modal/reducer'
import { getOpenModals } from 'decentraland-dapps/dist/modules/modal/selectors'
import {
  CLAIM_LAND_SUCCESS,
  UPSERT_RENTAL_SUCCESS,
  REMOVE_RENTAL_SUCCESS
} from '../rental/actions'
import { closeAllModals } from './actions'

export function* modalSaga() {
  yield takeEvery(LOCATION_CHANGE, handleLocationChange)
  yield takeEvery(
    [CLAIM_LAND_SUCCESS, UPSERT_RENTAL_SUCCESS],
    handleCloseAllModals
  )
  yield takeEvery(REMOVE_RENTAL_SUCCESS, handleCloseRemoveRentalModal)
}

function* handleLocationChange() {
  const openModals: ModalState = yield select(getOpenModals)
  if (Object.keys(openModals).length > 0) {
    yield delay(100)
    yield handleCloseAllModals()
  }
}

function* handleCloseAllModals() {
  yield put(closeAllModals())
}

function* handleCloseRemoveRentalModal() {
  const openModals: ModalState = yield select(getOpenModals)
  if (openModals['RemoveRentalModal']) {
    // if it's confirming the removal, we close all modals. Otherwise, it's in the upsert and we don't want to close modals.
    yield put(closeAllModals())
  }
}
