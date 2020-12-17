import { takeLatest, put, call, takeEvery } from 'redux-saga/effects'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS
} from 'decentraland-dapps/dist/modules/wallet/actions'
import {
  LOAD_PROFILE_REQUEST,
  LoadProfileRequestAction,
  loadProfileSuccess,
  loadProfileFailure,
  loadProfileRequest
} from './actions'
import { Profile } from './types'
import { content } from '../../lib/api/peer'

export function* profileSaga() {
  yield takeEvery(LOAD_PROFILE_REQUEST, handleLoadProfileRequest)
  yield takeLatest(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleLoadProfileRequest(action: LoadProfileRequestAction) {
  const { address } = action.payload
  try {
    const profile: Profile = yield call(() => content.fetchProfile(address))
    yield put(loadProfileSuccess(address, profile))
  } catch (error) {
    yield put(loadProfileFailure(address, error.message))
  }
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
  yield put(loadProfileRequest(action.payload.wallet.address))
}
