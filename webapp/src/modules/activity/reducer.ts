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
  loaded: number
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: ActivityState = {
  data: [],
  total: 0,
  loaded: 0,
  loading: [],
  error: null
}

type ActivityReducerAction = FetchUserActivityRequestAction | FetchUserActivitySuccessAction | FetchUserActivityFailureAction

// Append-mode reducer for infinite scroll. The first page (offset === 0) RESETS the list
// — typical scenarios: user navigates to the page fresh, or we re-fetch after a wallet
// change. Subsequent pages APPEND. We dedupe by event id to defend against the server
// returning the same event in adjacent pages (e.g. if new events arrive between requests
// and shift the slice boundary).
export function activityReducer(state = INITIAL_STATE, action: ActivityReducerAction): ActivityState {
  switch (action.type) {
    case FETCH_USER_ACTIVITY_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    case FETCH_USER_ACTIVITY_SUCCESS: {
      const { events, total, offset } = action.payload
      const isFirstPage = offset === 0
      const merged = isFirstPage ? events : [...state.data, ...events]
      const seenIds = new Set<string>()
      const deduped = merged.filter(ev => {
        if (seenIds.has(ev.id)) return false
        seenIds.add(ev.id)
        return true
      })
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: deduped,
        total,
        loaded: deduped.length
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
