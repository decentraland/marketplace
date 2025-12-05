import { call, takeEvery, put } from '@redux-saga/core/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { config } from '../../config'
import { isErrorWithMessage } from '../../lib/error'
import { waitForFeatureFlagsToBeLoaded } from '../features/utils'
import { AnalyticsService } from '../vendor/decentraland'
import { RankingsAPI } from '../vendor/decentraland/rankings/api'
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

const MARKETPLACE_SERVER_URL = config.get('MARKETPLACE_SERVER_URL')

export function* analyticsSagas() {
  yield takeEvery(FETCH_ANALYTICS_VOLUME_DATA_REQUEST, handleFetchVolumeDataRequest)
  yield takeEvery(FETCH_RANKINGS_REQUEST, handleFetchRankingsRequest)
}

export function* handleFetchVolumeDataRequest(action: FetchAnalyticsDayDataRequestAction) {
  const { timeframe } = action.payload

  try {
    yield call(waitForFeatureFlagsToBeLoaded)
    const analyticsService = new AnalyticsService(MARKETPLACE_SERVER_URL)
    const volumeData: AnalyticsVolumeData = yield call([analyticsService, 'fetchVolumeData'], timeframe)

    yield put(fetchAnalyticsVolumeDataSuccess(volumeData))
  } catch (error) {
    yield put(fetchAnalyticsVolumeDataFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

function* handleFetchRankingsRequest(action: FetchRankingsRequestAction) {
  const { entity, filters, timeframe } = action.payload
  try {
    yield call(waitForFeatureFlagsToBeLoaded)
    const rankingsAPI = new RankingsAPI(MARKETPLACE_SERVER_URL)
    const { data }: { data: RankingEntity[] } = yield call([rankingsAPI, 'fetch'], entity, timeframe, filters)
    yield put(fetchRankingsSuccess(data))
  } catch (error) {
    yield put(fetchRankingsFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}
