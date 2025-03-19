import { takeEvery, put, call, delay, take, select } from 'redux-saga/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { CONNECT_WALLET_SUCCESS, ConnectWalletSuccessAction } from 'decentraland-dapps/dist/modules/wallet/actions'
import { isErrorWithMessage } from '../../lib/error'
import { CreditsService } from '../vendor/decentraland'
import {
  FetchCreditsRequestAction,
  fetchCreditsSuccess,
  fetchCreditsFailure,
  fetchCreditsRequest,
  PollCreditsBalanceRequestAction,
  POLL_CREDITS_BALANCE_REQUEST,
  FETCH_CREDITS_REQUEST,
  FETCH_CREDITS_SUCCESS
} from './actions'
import { getCredits } from './selectors'
import { CreditsResponse } from './types'

const creditsService = new CreditsService()

export function* creditsSaga() {
  yield takeEvery(FETCH_CREDITS_REQUEST, handleFetchCreditsRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeEvery(POLL_CREDITS_BALANCE_REQUEST, handlePollCreditsBalanceRequest)
}

function* handleFetchCreditsRequest(action: FetchCreditsRequestAction) {
  console.log('handleFetchCreditsRequest', action)
  const { address } = action.payload

  try {
    const credits: CreditsResponse = yield call([creditsService, 'fetchCredits'], address)
    yield put(fetchCreditsSuccess(address, credits))
  } catch (error) {
    yield put(fetchCreditsFailure(address, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
  const { address } = action.payload.wallet
  yield put(fetchCreditsRequest(address))
}

function* handlePollCreditsBalanceRequest(action: PollCreditsBalanceRequestAction) {
  console.log('handlePollCreditsBalanceRequest', action)
  const { address, expectedBalance } = action.payload
  while (true) {
    console.log('handlePollCreditsBalanceRequest while0', address, expectedBalance)
    yield put(fetchCreditsRequest(address))
    yield take(FETCH_CREDITS_SUCCESS)
    const credits: CreditsResponse = yield select(getCredits, address)
    console.log('handlePollCreditsBalanceRequest while1', address, expectedBalance, credits)
    if (BigInt(credits.totalCredits) === expectedBalance) {
      console.log('handlePollCreditsBalanceRequest while2', address, expectedBalance, credits, 'break')
      yield put(fetchCreditsSuccess(address, credits))
      break
    }
    yield delay(1000)
  }
}

// Export for testing
export { creditsService }
