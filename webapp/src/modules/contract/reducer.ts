import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { Contract } from '../vendor/services'
import {
  FetchContractsFailureAction,
  FetchContractsRequestAction,
  FetchContractsSuccessAction,
  FETCH_CONTRACTS_FAILURE,
  FETCH_CONTRACTS_REQUEST,
  FETCH_CONTRACTS_SUCCESS
} from './actions'

export type ContractState = {
  data: Contract[]
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: ContractState = {
  data: [],
  loading: [],
  error: null
}

type ContractReducerAction =
  | FetchContractsRequestAction
  | FetchContractsSuccessAction
  | FetchContractsFailureAction

export function contractReducer(
  state = INITIAL_STATE,
  action: ContractReducerAction
): ContractState {
  switch (action.type) {
    case FETCH_CONTRACTS_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }

    case FETCH_CONTRACTS_SUCCESS:
      const { contracts } = action.payload

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: contracts
      }

    case FETCH_CONTRACTS_FAILURE:
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
