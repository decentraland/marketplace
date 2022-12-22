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
  FETCH_CONTRACTS_SUCCESS
} from './actions'
import { Network } from './types'

export type ContractState = {
  data: Contract[]
  loading: LoadingState
  error: string | null
}

const network = config.get('NETWORK') as Network
const networkContracts = contracts[network].map(contract => ({
  ...contract,
  address: contract.address.toLowerCase()
}))

export const INITIAL_STATE: ContractState = {
  data: networkContracts as Contract[],
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
    case FETCH_CONTRACTS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }

    case FETCH_CONTRACTS_SUCCESS: {
      const { contracts } = action.payload

      const contractsByAddressAndChain = state.data.reduce(
        (map, contract) =>
          map.set(`${contract.address}-${contract.chainId}`, { ...contract }),
        new Map<string, Contract>()
      )

      contracts.forEach(contract => {
        const address = contract.address.toLowerCase()

        contractsByAddressAndChain.set(`${address}-${contract.chainId}`, {
          ...contract,
          address
        })
      })

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: Array.from(contractsByAddressAndChain.values())
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

    default:
      return state
  }
}
