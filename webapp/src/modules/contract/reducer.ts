import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { config } from '../../config'
import { contracts } from '../vendor/decentraland'
import { Contract } from '../vendor/services'
import {
  FetchContractsFailureAction,
  FetchContractsRequestAction,
  FetchContractsSuccessAction,
  FETCH_CONTRACTS_FAILURE,
  FETCH_CONTRACTS_REQUEST,
  FETCH_CONTRACTS_SUCCESS,
  ResetHasFetchedAction,
  RESET_HAS_FETCHED,
  UpsertContractsAction,
  UPSERT_CONTRACTS
} from './actions'
import { Network } from './types'
import { upsertContracts } from './utils'

export type ContractState = {
  data: Contract[]
  loading: LoadingState
  error: string | null
  hasFetched: boolean
}

const network = config.get('NETWORK') as Network
const networkContracts = contracts[network].map(contract => ({
  ...contract,
  address: contract.address.toLowerCase()
}))

export const INITIAL_STATE: ContractState = {
  data: networkContracts as Contract[],
  loading: [],
  error: null,
  hasFetched: false
}

type ContractReducerAction =
  | FetchContractsRequestAction
  | FetchContractsSuccessAction
  | FetchContractsFailureAction
  | UpsertContractsAction
  | ResetHasFetchedAction

export function contractReducer(
  state = INITIAL_STATE,
  action: ContractReducerAction
): ContractState {
  switch (action.type) {
    case FETCH_CONTRACTS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }

    case FETCH_CONTRACTS_SUCCESS: {
      const { contracts } = action.payload

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: upsertContracts(state.data, contracts),
        hasFetched: true
      }
    }

    case FETCH_CONTRACTS_FAILURE: {
      const { error } = action.payload

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    }

    case UPSERT_CONTRACTS: {
      const { contracts } = action.payload

      return {
        ...state,
        data: upsertContracts(state.data, contracts)
      }
    }

    case RESET_HAS_FETCHED: {
      return {
        ...state,
        hasFetched: false
      }
    }

    default:
      return state
  }
}
