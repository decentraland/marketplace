import { call, put, select, take, takeLatest, takeLeading } from 'redux-saga/effects'
import { FETCH_APPLICATION_FEATURES_SUCCESS } from 'decentraland-dapps/dist/modules/features/actions'
import { hasLoadedInitialFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { isErrorWithMessage } from '../../lib/error'
import { getIsCancelledOrdersBannerEnabled } from '../features/selectors'
import { GENERATE_IDENTITY_SUCCESS } from '../identity/actions'
import { CancelledTradesAPI } from '../vendor/decentraland/cancelledTrades/api'
import { CancellationReason } from '../vendor/decentraland/cancelledTrades/types'
import { MARKETPLACE_SERVER_URL } from '../vendor/decentraland/marketplace/api'
import { retryParams } from '../vendor/decentraland/utils'
import {
  FETCH_CANCELLED_TRADES_REQUEST,
  FetchCancelledTradesRequestAction,
  fetchCancelledTradesFailure,
  fetchCancelledTradesRequest,
  fetchCancelledTradesSuccess
} from './actions'

export const CANCELLED_TRADES_PAGE_SIZE = 100

export function* cancelledTradesSaga(getIdentity: () => AuthIdentity | undefined) {
  const api = new CancelledTradesAPI(MARKETPLACE_SERVER_URL, {
    retries: retryParams.attempts,
    retryDelay: retryParams.delay,
    identity: getIdentity
  })

  yield takeLatest(GENERATE_IDENTITY_SUCCESS, handleGenerateIdentitySuccess)
  // Ignores scroll-triggered requests while a page is in flight.
  yield takeLeading(FETCH_CANCELLED_TRADES_REQUEST, handleFetchCancelledTradesRequest)

  // The request is signed, so it waits for the identity instead of the wallet.
  function* handleGenerateIdentitySuccess() {
    const hasLoadedFlags = (yield select(hasLoadedInitialFlags)) as boolean
    if (!hasLoadedFlags) {
      yield take(FETCH_APPLICATION_FEATURES_SUCCESS)
    }

    const isEnabled = (yield select(getIsCancelledOrdersBannerEnabled)) as boolean
    if (isEnabled) {
      yield put(fetchCancelledTradesRequest())
    }
  }

  function* handleFetchCancelledTradesRequest(action: FetchCancelledTradesRequestAction) {
    const { skip } = action.payload
    try {
      const { data, total } = (yield call([api, 'fetchCancelledTrades'], {
        reason: CancellationReason.CONTRACT_SIGNATURE_INDEX_BUMP,
        first: CANCELLED_TRADES_PAGE_SIZE,
        skip
      })) as Awaited<ReturnType<typeof api.fetchCancelledTrades>>
      yield put(fetchCancelledTradesSuccess(data, total, skip))
    } catch (error) {
      yield put(fetchCancelledTradesFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }
}
