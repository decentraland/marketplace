import { takeEvery, put, call, delay, take, select } from 'redux-saga/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { CONNECT_WALLET_SUCCESS, ConnectWalletSuccessAction } from 'decentraland-dapps/dist/modules/wallet/actions'
import { config } from '../../config'
import { isErrorWithMessage } from '../../lib/error'
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

export function* creditsSaga() {
  yield takeEvery(FETCH_CREDITS_REQUEST, handleFetchCreditsRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeEvery(POLL_CREDITS_BALANCE_REQUEST, handlePollCreditsBalanceRequest)
}

function* handleFetchCreditsRequest(action: FetchCreditsRequestAction) {
  const { address } = action.payload

  try {
    const response: Response = yield call(fetch, `${config.get('CREDITS_SERVER_URL')}/users/${address}/credits`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch credits')
    }

    const credits: CreditsResponse = yield call([response, 'json'])
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
  const { address, expectedBalance } = action.payload
  while (true) {
    yield put(fetchCreditsRequest(address))
    console.log('fetchCreditsRequest in handlePollCreditsBalanceRequest')
    yield take(FETCH_CREDITS_SUCCESS)
    console.log('FETCH_CREDITS_SUCCESS in handlePollCreditsBalanceRequest')
    const credits: CreditsResponse = yield select(getCredits, address)
    console.log('credits in handlePollCreditsBalanceRequest', credits)
    if (BigInt(credits.totalCredits) === expectedBalance) {
      yield put(fetchCreditsSuccess(address, credits))
      break
    }
    yield delay(1000)
  }
}
