import { action } from 'typesafe-actions'
import { AnalyticsTimeframe, AnalyticsVolumeData } from './types'

export const FETCH_ANALYTICS_VOLUME_DATA_REQUEST = '[Request] Fetch Volume Data'
export const FETCH_ANALYTICS_VOLUME_DATA_SUCCESS = '[Success] Fetch Volume Data'
export const FETCH_ANALYTICS_VOLUME_DATA_FAILURE = '[Failure] Fetch Volume Data'

export const fetchAnalyticsVolumeDataRequest = (
  timeframe: AnalyticsTimeframe
) => action(FETCH_ANALYTICS_VOLUME_DATA_REQUEST, { timeframe })
export const fetchAnalyticsVolumeDataSuccess = (
  analyticsVolumeData: AnalyticsVolumeData
) => action(FETCH_ANALYTICS_VOLUME_DATA_SUCCESS, { analyticsVolumeData })
export const fetchAnalyticsVolumeDataFailure = (error: string) =>
  action(FETCH_ANALYTICS_VOLUME_DATA_FAILURE, { error })

export type FetchAnalyticsDayDataRequestAction = ReturnType<
  typeof fetchAnalyticsVolumeDataRequest
>
export type FetchAnalyticsDayDataSuccessAction = ReturnType<
  typeof fetchAnalyticsVolumeDataSuccess
>
export type FetchAnalyticsDayDataFailureAction = ReturnType<
  typeof fetchAnalyticsVolumeDataFailure
>
