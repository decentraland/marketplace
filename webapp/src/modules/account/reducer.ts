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
  FetchCreatorsAccountFailureAction,
  FetchCreatorsAccountRequestAction,
  FetchCreatorsAccountSuccessAction,
  FETCH_ACCOUNT_METRICS_FAILURE,
  FETCH_ACCOUNT_METRICS_REQUEST,
  FETCH_ACCOUNT_METRICS_SUCCESS,
  FETCH_CREATORS_ACCOUNT_FAILURE,
  FETCH_CREATORS_ACCOUNT_REQUEST,
  FETCH_CREATORS_ACCOUNT_SUCCESS
} from './actions'
import { Account, AccountMetrics, CreatorAccount } from './types'

export type AccountState = {
  data: Record<string, Account>
  metrics: {
    [Network.ETHEREUM]: Record<string, AccountMetrics>
    [Network.MATIC]: Record<string, AccountMetrics>
  }
  creators: {
    accounts: CreatorAccount[]
    search: string | null
  }
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: AccountState = {
  data: {},
  metrics: {
    [Network.ETHEREUM]: {},
    [Network.MATIC]: {}
  },
  creators: { accounts: [], search: null },
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
  | FetchCreatorsAccountRequestAction
  | FetchCreatorsAccountSuccessAction
  | FetchCreatorsAccountFailureAction

export function accountReducer(
  state: AccountState = INITIAL_STATE,
  action: AccountReducerAction
): AccountState {
  switch (action.type) {
    case FETCH_CREATORS_ACCOUNT_REQUEST:
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
    case FETCH_CREATORS_ACCOUNT_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        creators: {
          accounts: action.payload.creatorAccounts,
          search: action.payload.search
        },
        error: null
      }
    }
    case FETCH_CREATORS_ACCOUNT_FAILURE: {
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
