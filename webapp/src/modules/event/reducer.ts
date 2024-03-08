import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchEventFailureAction,
  FetchEventRequestAction,
  FetchEventSuccessAction,
  FETCH_EVENT_FAILURE,
  FETCH_EVENT_REQUEST,
  FETCH_EVENT_SUCCESS
} from './actions'

export type EventState = {
  data: Record<string, string[]>
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: EventState = {
  data: {},
  loading: [],
  error: null
}

type EventReducerAction = FetchEventRequestAction | FetchEventSuccessAction | FetchEventFailureAction

export function eventReducer(state = INITIAL_STATE, action: EventReducerAction): EventState {
  switch (action.type) {
    case FETCH_EVENT_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_EVENT_SUCCESS:
      const { eventTag, contracts } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [eventTag]: contracts
        }
      }
    case FETCH_EVENT_FAILURE:
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
