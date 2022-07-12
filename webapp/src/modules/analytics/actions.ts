import { action } from 'typesafe-actions'
import {
  AnalyticsTimeframe,
  AnalyticsVolumeData,
  RankingEntities,
  RankingEntity,
  RankingsFilters
} from './types'

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

// Fetch Rankings

export const FETCH_RANKINGS_REQUEST = '[Request] Fetch Rankings'
export const FETCH_RANKINGS_SUCCESS = '[Success] Fetch Rankings'
export const FETCH_RANKINGS_FAILURE = '[Failure] Fetch Rankings'

export const fetchRankingsRequest = (
  entity: RankingEntities,
  timeframe: AnalyticsTimeframe,
  filters?: RankingsFilters
) => action(FETCH_RANKINGS_REQUEST, { entity, timeframe, filters })

export const fetchRankingsSuccess = (results: RankingEntity[]) =>
  action(FETCH_RANKINGS_SUCCESS, { results })

export const fetchRankingsFailure = (error: string) =>
  action(FETCH_RANKINGS_FAILURE, { error })

export type FetchRankingsRequestAction = ReturnType<typeof fetchRankingsRequest>
export type FetchRankingsSuccessAction = ReturnType<typeof fetchRankingsSuccess>
export type FetchRankingsFailureAction = ReturnType<typeof fetchRankingsFailure>
