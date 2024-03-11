import { LoadingState, loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { FetchTransactionSuccessAction } from 'decentraland-dapps/dist/modules/transaction/actions'
import {
  ClaimNameRequestAction,
  ClaimNameFailureAction,
  ClaimNameSuccessAction,
  CLAIM_NAME_SUCCESS,
  CLAIM_NAME_FAILURE,
  CLAIM_NAME_REQUEST,
  ClaimNameCrossChainRequestAction,
  ClaimNameCrossChainSuccessAction,
  ClaimNameCrossChainFailureAction,
  CLAIM_NAME_CROSS_CHAIN_REQUEST,
  CLAIM_NAME_CROSS_CHAIN_SUCCESS,
  CLAIM_NAME_CROSS_CHAIN_FAILURE
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

const isENSError = (error: any): error is ENSError => {
  return error && error.message !== undefined
}

export type ENSReducerAction =
  | FetchTransactionSuccessAction
  | ClaimNameRequestAction
  | ClaimNameFailureAction
  | ClaimNameSuccessAction
  | ClaimNameCrossChainRequestAction
  | ClaimNameCrossChainSuccessAction
  | ClaimNameCrossChainFailureAction

export function ensReducer(state: ENSState = INITIAL_STATE, action: ENSReducerAction): ENSState {
  switch (action.type) {
    case CLAIM_NAME_CROSS_CHAIN_REQUEST:
    case CLAIM_NAME_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case CLAIM_NAME_CROSS_CHAIN_SUCCESS:
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

    case CLAIM_NAME_CROSS_CHAIN_FAILURE:
    case CLAIM_NAME_FAILURE: {
      const error = isENSError(action.payload.error) ? action.payload.error : { message: action.payload.error }
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
