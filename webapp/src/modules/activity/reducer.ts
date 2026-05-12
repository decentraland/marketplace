import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FETCH_USER_ACTIVITY_FAILURE,
  FETCH_USER_ACTIVITY_REQUEST,
  FETCH_USER_ACTIVITY_SUCCESS,
  FetchUserActivityFailureAction,
  FetchUserActivityRequestAction,
  FetchUserActivitySuccessAction
} from './actions'
import { ActivityEvent } from './types'

export type ActivityState = {
  data: ActivityEvent[]
  total: number
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: ActivityState = {
  data: [],
  total: 0,
  loading: [],
  error: null
}

type ActivityReducerAction = FetchUserActivityRequestAction | FetchUserActivitySuccessAction | FetchUserActivityFailureAction

export function activityReducer(state = INITIAL_STATE, action: ActivityReducerAction): ActivityState {
  switch (action.type) {
    case FETCH_USER_ACTIVITY_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    case FETCH_USER_ACTIVITY_SUCCESS: {
      const { events, total } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: events,
        total
      }
    }
    case FETCH_USER_ACTIVITY_FAILURE: {
      const { error } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    }
    default:
      return state
  }
}
