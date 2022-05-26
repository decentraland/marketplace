import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchAnalyticsDayDataRequestAction,
  FetchAnalyticsDayDataSuccessAction,
  FetchAnalyticsDayDataFailureAction,
  FETCH_ANALYTICS_VOLUME_DATA_REQUEST,
  FETCH_ANALYTICS_VOLUME_DATA_SUCCESS,
  FETCH_ANALYTICS_VOLUME_DATA_FAILURE
} from './actions'
import { AnalyticsVolumeData } from './types'

export type AnalyticsState = {
  volumeData: AnalyticsVolumeData | null
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: AnalyticsState = {
  volumeData: null,
  loading: [],
  error: null
}

type AnalyticsReducerAction =
  | FetchAnalyticsDayDataRequestAction
  | FetchAnalyticsDayDataSuccessAction
  | FetchAnalyticsDayDataFailureAction

export function analyticsReducer(
  state = INITIAL_STATE,
  action: AnalyticsReducerAction
): AnalyticsState {
  switch (action.type) {
    case FETCH_ANALYTICS_VOLUME_DATA_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_ANALYTICS_VOLUME_DATA_SUCCESS:
      const { analyticsVolumeData } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        volumeData: analyticsVolumeData
      }
    case FETCH_ANALYTICS_VOLUME_DATA_FAILURE:
      const { error } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    default:
      return state
  }
}
