import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchCreditsRequestAction,
  FetchCreditsSuccessAction,
  FetchCreditsFailureAction,
  FETCH_CREDITS_REQUEST,
  FETCH_CREDITS_SUCCESS,
  FETCH_CREDITS_FAILURE
} from './actions'
import { CreditsResponse } from './types'

export type CreditsState = {
  data: Record<string, CreditsResponse>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: CreditsState = {
  data: {},
  loading: [],
  error: null
}

type CreditsReducerAction = FetchCreditsRequestAction | FetchCreditsSuccessAction | FetchCreditsFailureAction

export function creditsReducer(state = INITIAL_STATE, action: CreditsReducerAction): CreditsState {
  switch (action.type) {
    case FETCH_CREDITS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }

    case FETCH_CREDITS_SUCCESS: {
      const { address, credits } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [address]: credits
        },
        error: null
      }
    }

    case FETCH_CREDITS_FAILURE: {
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
