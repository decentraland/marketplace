import { call, takeEvery, put } from '@redux-saga/core/effects'
import { VendorFactory, VendorName } from '../vendor'
import {
  fetchAnalyticsVolumeDataFailure,
  FetchAnalyticsDayDataRequestAction,
  fetchAnalyticsVolumeDataSuccess,
  FETCH_ANALYTICS_VOLUME_DATA_REQUEST
} from './actions'
import { AnalyticsVolumeData } from './types'

export function* analyticsSagas() {
  yield takeEvery(
    FETCH_ANALYTICS_VOLUME_DATA_REQUEST,
    handleFetchVolumeDataRequest
  )
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
