import { call, takeEvery, put } from '@redux-saga/core/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { rankingsAPI } from '../vendor/decentraland/rankings/api'
import { AnalyticsService } from '../vendor/decentraland'
import {
  fetchAnalyticsVolumeDataFailure,
  FetchAnalyticsDayDataRequestAction,
  fetchAnalyticsVolumeDataSuccess,
  FETCH_ANALYTICS_VOLUME_DATA_REQUEST,
  FETCH_RANKINGS_REQUEST,
  FetchRankingsRequestAction,
  fetchRankingsSuccess,
  fetchRankingsFailure
} from './actions'
import { AnalyticsVolumeData, RankingEntity } from './types'

export function* analyticsSagas() {
  yield takeEvery(
    FETCH_ANALYTICS_VOLUME_DATA_REQUEST,
    handleFetchVolumeDataRequest
  )
  yield takeEvery(FETCH_RANKINGS_REQUEST, handleFetchRankingsRequest)
}

export function* handleFetchVolumeDataRequest(
  action: FetchAnalyticsDayDataRequestAction
) {
  const { timeframe } = action.payload

  try {
    const analyticsService = new AnalyticsService()
    const volumeData: AnalyticsVolumeData = yield call(
      [analyticsService, 'fetchVolumeData'],
      timeframe
    )

    yield put(fetchAnalyticsVolumeDataSuccess(volumeData))
  } catch (error) {
    yield put(
      fetchAnalyticsVolumeDataFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}

function* handleFetchRankingsRequest(action: FetchRankingsRequestAction) {
  const { entity, filters, timeframe } = action.payload
  try {
    const { data }: { data: RankingEntity[] } = yield call(
      [rankingsAPI, 'fetch'],
      entity,
      timeframe,
      filters
    )
    yield put(fetchRankingsSuccess(data))
  } catch (error) {
    yield put(
      fetchRankingsFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}
