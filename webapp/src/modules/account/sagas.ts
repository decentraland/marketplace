import { Network } from '@dcl/schemas'
import { call, takeEvery, put, all } from '@redux-saga/core/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { accountAPI } from '../vendor/decentraland'
import { AccountResponse } from '../vendor/decentraland/account/types'
import {
  fetchAccountMetricsFailure,
  FetchAccountMetricsRequestAction,
  fetchAccountMetricsSuccess,
  FETCH_ACCOUNT_METRICS_REQUEST
} from './actions'

export function* accountSaga() {
  yield takeEvery(
    FETCH_ACCOUNT_METRICS_REQUEST,
    handleFetchAccountMetricsRequest
  )
}

export function* handleFetchAccountMetricsRequest(
  action: FetchAccountMetricsRequestAction
) {
  const { filters } = action.payload

  try {
    const results: AccountResponse[] = yield all([
      call([accountAPI, accountAPI.fetch], {
        ...filters,
        network: Network.ETHEREUM
      }),
      call([accountAPI, accountAPI.fetch], {
        ...filters,
        network: Network.MATIC
      })
    ])

    yield put(
      fetchAccountMetricsSuccess(filters, {
        [Network.ETHEREUM]: results[0].data,
        [Network.MATIC]: results[1].data
      })
    )
  } catch (error) {
    yield put(
      fetchAccountMetricsFailure(
        filters,
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}
