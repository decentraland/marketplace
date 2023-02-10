import { LoadingState, loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchProximityRequestAction,
  FetchProximitySuccessAction,
  FetchProximityFailureAction,
  FETCH_PROXIMITY_REQUEST,
  FETCH_PROXIMITY_SUCCESS,
  FETCH_PROXIMITY_FAILURE
} from './actions'
import { Proximity } from './types'

type ProximityState = {
  data: Record<string, Proximity>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: ProximityState = {
  data: {},
  loading: [],
  error: null
}

type ProximityReducerAction = FetchProximityRequestAction | FetchProximitySuccessAction | FetchProximityFailureAction

export function proximityReducer(state = INITIAL_STATE, action: ProximityReducerAction) {
  switch (action.type) {
    case FETCH_PROXIMITY_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_PROXIMITY_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: action.payload.proximity
      }
    }
    case FETCH_PROXIMITY_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    default:
      return state
  }
}
