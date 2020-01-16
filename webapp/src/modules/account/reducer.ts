import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { Account } from './types'
import {
  FetchAccountRequestAction,
  FetchAccountSuccessAction,
  FetchAccountFailureAction,
  FETCH_ACCOUNT_REQUEST,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_FAILURE
} from './actions'

export type AccountState = {
  data: Record<string, Account>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

type AccountReducerAction =
  | FetchAccountRequestAction
  | FetchAccountSuccessAction
  | FetchAccountFailureAction

export function accountReducer(
  state: AccountState = INITIAL_STATE,
  action: AccountReducerAction
): AccountState {
  switch (action.type) {
    case FETCH_ACCOUNT_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_ACCOUNT_SUCCESS: {
      const { account } = action.payload
      const newData = account ? { [account.address]: { ...account } } : {}
      return {
        ...state,
        data: {
          ...state.data,
          ...newData
        },
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case FETCH_ACCOUNT_FAILURE: {
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
