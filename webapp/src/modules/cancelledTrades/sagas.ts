import { call, put, select, take, takeLatest } from 'redux-saga/effects'
import { FETCH_APPLICATION_FEATURES_SUCCESS } from 'decentraland-dapps/dist/modules/features/actions'
import { hasLoadedInitialFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { isErrorWithMessage } from '../../lib/error'
import { getIsCancelledOrdersBannerEnabled } from '../features/selectors'
import { GENERATE_IDENTITY_SUCCESS, GenerateIdentitySuccessAction } from '../identity/actions'
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
  yield takeLatest(FETCH_CANCELLED_TRADES_REQUEST, handleFetchCancelledTradesRequest)

  // The request is signed, so it waits for the identity instead of the wallet.
  function* handleGenerateIdentitySuccess(action: GenerateIdentitySuccessAction) {
    const hasLoadedFlags = (yield select(hasLoadedInitialFlags)) as boolean
    if (!hasLoadedFlags) {
      yield take(FETCH_APPLICATION_FEATURES_SUCCESS)
    }

    const isEnabled = (yield select(getIsCancelledOrdersBannerEnabled)) as boolean
    if (isEnabled) {
      yield put(fetchCancelledTradesRequest(action.payload.address))
    }
  }

  function* handleFetchCancelledTradesRequest(action: FetchCancelledTradesRequestAction) {
    const { address } = action.payload
    try {
      const { data, total } = (yield call([api, 'fetchCancelledTrades'], {
        reason: CancellationReason.CONTRACT_SIGNATURE_INDEX_BUMP,
        first: CANCELLED_TRADES_PAGE_SIZE
      })) as Awaited<ReturnType<typeof api.fetchCancelledTrades>>
      yield put(fetchCancelledTradesSuccess(address, data, total))
    } catch (error) {
      yield put(fetchCancelledTradesFailure(address, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }
}
