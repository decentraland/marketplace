import { LOCATION_CHANGE } from 'connected-react-router'
import { delay, put, select, takeEvery } from 'redux-saga/effects'
import { ModalState } from 'decentraland-dapps/dist/modules/modal/reducer'
import { getOpenModals } from 'decentraland-dapps/dist/modules/modal/selectors'
import { closeAllModals } from './actions'
import { CLAIM_LAND_SUCCESS } from '../rental/actions'

export function* modalSaga() {
  yield takeEvery(LOCATION_CHANGE, handleLocationChange)
  yield takeEvery([CLAIM_LAND_SUCCESS], handleCloseAllModals)
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
