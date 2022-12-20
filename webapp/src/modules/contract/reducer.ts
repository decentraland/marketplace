import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { Contract } from '../vendor/services'
import {
  AddContractsAction,
  ADD_CONTRACTS,
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
  hasIncludedMaticCollections: boolean
}

export const INITIAL_STATE: ContractState = {
  data: [],
  loading: [],
  error: null,
  hasIncludedMaticCollections: false
}

type ContractReducerAction =
  | FetchContractsRequestAction
  | FetchContractsSuccessAction
  | FetchContractsFailureAction
  | AddContractsAction

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
      const { includeMaticCollections, contracts } = action.payload

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: contracts,
        // This is used to prevent the contracts request to the nft server to be done more than once.
        // Will remain true after the first time the request is done.
        hasIncludedMaticCollections:
          state.hasIncludedMaticCollections || includeMaticCollections
      }

    case FETCH_CONTRACTS_FAILURE:
      const { error } = action.payload

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }

    case ADD_CONTRACTS: {
      const { contracts } = action.payload

      return {
        ...state,
        data: [...state.data, ...contracts]
      }
    }
    default:
      return state
  }
}
