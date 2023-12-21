import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { FetchTransactionSuccessAction } from 'decentraland-dapps/dist/modules/transaction/actions'
import {
  ClaimNameRequestAction,
  ClaimNameFailureAction,
  ClaimNameSuccessAction,
  CLAIM_NAME_SUCCESS,
  CLAIM_NAME_CLEAR,
  ClaimNameClearAction,
  CLAIM_NAME_FAILURE
} from './actions'
import { ENS, ENSError, Authorization } from './types'

export type ENSState = {
  data: Record<string, ENS>
  authorizations: Record<string, Authorization>
  loading: LoadingState
  error: ENSError | null
}

const INITIAL_STATE: ENSState = {
  data: {},
  authorizations: {},
  loading: [],
  error: null
}

export type ENSReducerAction =
  | FetchTransactionSuccessAction
  | ClaimNameRequestAction
  | ClaimNameFailureAction
  | ClaimNameSuccessAction
  | ClaimNameClearAction

export function ensReducer(
  state: ENSState = INITIAL_STATE,
  action: ENSReducerAction
): ENSState {
  switch (action.type) {
    case CLAIM_NAME_SUCCESS: {
      const { ens } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [ens.subdomain]: {
            ...state.data[ens.subdomain],
            ...ens
          }
        }
      }
    }
    case CLAIM_NAME_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: { ...action.payload.error }
      }
    }
    case CLAIM_NAME_CLEAR: {
      return {
        ...state,
        error: null
      }
    }

    default:
      return state
  }
}
