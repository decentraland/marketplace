import { Network } from '@dcl/schemas'
import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchNFTsRequestAction,
  FetchNFTsSuccessAction,
  FetchNFTsFailureAction,
  FETCH_NFTS_REQUEST,
  FETCH_NFTS_SUCCESS,
  FETCH_NFTS_FAILURE
} from '../nft/actions'
import {
  FetchAccountMetricsFailureAction,
  FetchAccountMetricsRequestAction,
  FetchAccountMetricsSuccessAction,
  FETCH_ACCOUNT_METRICS_FAILURE,
  FETCH_ACCOUNT_METRICS_REQUEST,
  FETCH_ACCOUNT_METRICS_SUCCESS
} from './actions'
import { Account, AccountMetrics } from './types'

export type AccountState = {
  data: Record<string, Account>
  metrics: Record<Network, Record<string, AccountMetrics>>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: AccountState = {
  data: {},
  metrics: {
    [Network.ETHEREUM]: {},
    [Network.MATIC]: {}
  },
  loading: [],
  error: null
}

type AccountReducerAction =
  | FetchNFTsRequestAction
  | FetchNFTsSuccessAction
  | FetchNFTsFailureAction
  | FetchAccountMetricsRequestAction
  | FetchAccountMetricsSuccessAction
  | FetchAccountMetricsFailureAction

export function accountReducer(
  state: AccountState = INITIAL_STATE,
  action: AccountReducerAction
): AccountState {
  switch (action.type) {
    case FETCH_ACCOUNT_METRICS_REQUEST:
    case FETCH_NFTS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_ACCOUNT_METRICS_SUCCESS: {
      const { accountMetrics } = action.payload

      const metrics = {
        [Network.ETHEREUM]: accountMetrics.ETHEREUM.reduce(
          (acc, metrics) => {
            acc[metrics.address] = metrics
            return acc
          },
          { ...state.metrics.ETHEREUM }
        ),
        [Network.MATIC]: accountMetrics.MATIC.reduce(
          (acc, metrics) => {
            acc[metrics.address] = metrics
            return acc
          },
          { ...state.metrics.MATIC }
        )
      }

      return {
        ...state,
        metrics,
        error: null,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_NFTS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.accounts.reduce((obj, account) => {
            obj[account.address] = account
            return obj
          }, {} as Record<string, Account>)
        },
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case FETCH_ACCOUNT_METRICS_FAILURE:
    case FETCH_NFTS_FAILURE: {
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
