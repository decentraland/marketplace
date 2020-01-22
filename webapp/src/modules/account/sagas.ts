import { put, call, takeEvery } from 'redux-saga/effects'
import {
  FETCH_ACCOUNT_REQUEST,
  FetchAccountRequestAction,
  fetchAccountSuccess,
  fetchAccountFailure
} from './actions'
import { account as accountAPI } from '../../lib/api/account'

export function* accountSaga() {
  yield takeEvery(FETCH_ACCOUNT_REQUEST, handleFetchAccountRequest)
}

function* handleFetchAccountRequest(action: FetchAccountRequestAction) {
  const { options } = action.payload

  try {
    const [account, nfts, orders] = yield call(() =>
      accountAPI.fetchAccount(options)
    )
    yield put(fetchAccountSuccess(options, account, nfts, orders))
  } catch (error) {
    console.log(error)
    yield put(fetchAccountFailure(options, error.message))
  }
}
