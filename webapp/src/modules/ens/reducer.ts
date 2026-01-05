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
  CLAIM_NAME_CROSS_CHAIN_FAILURE,
  ClaimNameWithCreditsRequestAction,
  ClaimNameWithCreditsSuccessAction,
  ClaimNameWithCreditsFailureAction,
  ClaimNameWithCreditsCrossChainPollingAction,
  ClaimNameWithCreditsRouteExpiredAction,
  ClaimNameWithCreditsClearProgressAction,
  CLAIM_NAME_WITH_CREDITS_REQUEST,
  CLAIM_NAME_WITH_CREDITS_SUCCESS,
  CLAIM_NAME_WITH_CREDITS_FAILURE,
  CLAIM_NAME_WITH_CREDITS_CROSS_CHAIN_POLLING,
  CLAIM_NAME_WITH_CREDITS_ROUTE_EXPIRED,
  CLAIM_NAME_WITH_CREDITS_CLEAR_PROGRESS
} from './actions'
import { ENS, ENSError, Authorization, CreditsClaimProgress } from './types'

export type ENSState = {
  data: Record<string, ENS>
  authorizations: Record<string, Authorization>
  loading: LoadingState
  error: ENSError | null
  creditsClaimProgress: CreditsClaimProgress | null
}

const INITIAL_STATE: ENSState = {
  data: {},
  authorizations: {},
  loading: [],
  error: null,
  creditsClaimProgress: null
}

const isENSError = (error: unknown): error is ENSError => {
  return error !== undefined && error !== null && typeof error === 'object' && 'message' in error
}

export type ENSReducerAction =
  | FetchTransactionSuccessAction
  | ClaimNameRequestAction
  | ClaimNameFailureAction
  | ClaimNameSuccessAction
  | ClaimNameCrossChainRequestAction
  | ClaimNameCrossChainSuccessAction
  | ClaimNameCrossChainFailureAction
  | ClaimNameWithCreditsRequestAction
  | ClaimNameWithCreditsSuccessAction
  | ClaimNameWithCreditsFailureAction
  | ClaimNameWithCreditsCrossChainPollingAction
  | ClaimNameWithCreditsRouteExpiredAction
  | ClaimNameWithCreditsClearProgressAction

export function ensReducer(state: ENSState = INITIAL_STATE, action: ENSReducerAction): ENSState {
  switch (action.type) {
    case CLAIM_NAME_CROSS_CHAIN_REQUEST:
    case CLAIM_NAME_REQUEST:
    case CLAIM_NAME_WITH_CREDITS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        creditsClaimProgress: null
      }
    }

    case CLAIM_NAME_WITH_CREDITS_ROUTE_EXPIRED: {
      const { name } = action.payload
      return {
        ...state,
        creditsClaimProgress: {
          name,
          polygonTxHash: '',
          coralScanUrl: '',
          status: 'refetching_route'
        }
      }
    }

    case CLAIM_NAME_WITH_CREDITS_CROSS_CHAIN_POLLING: {
      const { name, polygonTxHash, coralScanUrl } = action.payload
      return {
        ...state,
        creditsClaimProgress: {
          name,
          polygonTxHash,
          coralScanUrl,
          status: 'polling'
        }
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

    case CLAIM_NAME_WITH_CREDITS_SUCCESS: {
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
        },
        creditsClaimProgress: state.creditsClaimProgress ? { ...state.creditsClaimProgress, status: 'success' } : null
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

    case CLAIM_NAME_WITH_CREDITS_FAILURE: {
      const error = isENSError(action.payload.error) ? action.payload.error : { message: action.payload.error }
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error,
        creditsClaimProgress: state.creditsClaimProgress ? { ...state.creditsClaimProgress, status: 'failed' } : null
      }
    }

    case CLAIM_NAME_WITH_CREDITS_CLEAR_PROGRESS: {
      return {
        ...state,
        creditsClaimProgress: null
      }
    }

    default:
      return state
  }
}
