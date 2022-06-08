import { call, takeEvery, put } from '@redux-saga/core/effects'
import { VendorFactory, VendorName } from '../vendor'
import { rankingsAPI } from '../vendor/decentraland/rankings/api'
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
    const { analyticsService } = VendorFactory.build(VendorName.DECENTRALAND)
    const volumeData: AnalyticsVolumeData = yield call(
      [analyticsService, analyticsService!.fetchVolumeData],
      timeframe
    )

    yield put(fetchAnalyticsVolumeDataSuccess(volumeData))
  } catch (error) {
    yield put(fetchAnalyticsVolumeDataFailure(error.message))
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
    yield put(fetchRankingsFailure(error.message))
  }
}
