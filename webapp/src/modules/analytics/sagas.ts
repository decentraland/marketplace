import { call, takeEvery, put, select } from '@redux-saga/core/effects'
import { FETCH_APPLICATION_FEATURES_SUCCESS } from 'decentraland-dapps/dist/modules/features/actions'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { config } from '../../config'
import { isErrorWithMessage } from '../../lib/error'
import { getIsSegmentKillSwitchEnabled } from '../features/selectors'
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
import { persistSegmentKillSwitch } from './proxy'
import { AnalyticsVolumeData, RankingEntity } from './types'

const MARKETPLACE_SERVER_URL = config.get('MARKETPLACE_SERVER_URL')

export function* analyticsSagas() {
  yield takeEvery(FETCH_ANALYTICS_VOLUME_DATA_REQUEST, handleFetchVolumeDataRequest)
  yield takeEvery(FETCH_RANKINGS_REQUEST, handleFetchRankingsRequest)
  yield takeEvery(FETCH_APPLICATION_FEATURES_SUCCESS, handleFetchApplicationFeaturesSuccess)
}

/**
 * The analytics middleware is created before any flag is fetched, so the value is recorded here for the
 * next boot to read. Runs on every successful fetch, including the polling ones, so flipping the flag
 * reaches a long lived tab's next reload rather than waiting for a new session.
 */
export function* handleFetchApplicationFeaturesSuccess() {
  const isKillSwitchEnabled: boolean = yield select(getIsSegmentKillSwitchEnabled)

  persistSegmentKillSwitch(isKillSwitchEnabled)
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
