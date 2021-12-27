import { call, takeLatest } from 'redux-saga/effects'
import { getIdentity } from '../identity/utils'
import { UpdateStoreRequestAction, UPDATE_STORE_REQUEST } from './actions'
import { AuthIdentity } from 'dcl-crypto'

export function* storeSaga() {
  yield takeLatest(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)
}

function* handleUpdateStoreRequest(_action: UpdateStoreRequestAction) {
  const identity: AuthIdentity = yield call(getIdentity)
  console.log(identity)
}
