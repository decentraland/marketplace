import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchTransactionSuccessAction,
  FETCH_TRANSACTION_SUCCESS
} from 'decentraland-dapps/dist/modules/transaction/actions'

import { Authorization } from './types'
import {
  FetchAuthorizationRequestAction,
  FetchAuthorizationSuccessAction,
  FetchAuthorizationFailureAction,
  ApproveTokenRequestAction,
  ApproveTokenSuccessAction,
  ApproveTokenFailureAction,
  AllowTokenRequestAction,
  AllowTokenSuccessAction,
  AllowTokenFailureAction,
  FETCH_AUTHORIZATION_REQUEST,
  FETCH_AUTHORIZATION_SUCCESS,
  FETCH_AUTHORIZATION_FAILURE,
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS
} from './actions'

export type AuthorizationState = {
  data: Record<string, Authorization>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}
const EMPTY_ADDRESS_STATE: Authorization = { allowances: {}, approvals: {} }

type AuthorizationReducerAction =
  | FetchAuthorizationRequestAction
  | FetchAuthorizationSuccessAction
  | FetchAuthorizationFailureAction
  | ApproveTokenRequestAction
  | ApproveTokenSuccessAction
  | ApproveTokenFailureAction
  | AllowTokenRequestAction
  | AllowTokenSuccessAction
  | AllowTokenFailureAction
  | FetchTransactionSuccessAction

export function authorizationReducer(
  state: AuthorizationState = INITIAL_STATE,
  action: AuthorizationReducerAction
) {
  switch (action.type) {
    case FETCH_AUTHORIZATION_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_AUTHORIZATION_SUCCESS: {
      const { address, authorization } = action.payload
      const addressState = state.data[address] || EMPTY_ADDRESS_STATE

      const allowances = { ...addressState.allowances }
      const approvals = { ...addressState.approvals }

      for (const contractName in authorization.allowances) {
        allowances[contractName] = {
          ...allowances[contractName],
          ...authorization.allowances[contractName]
        }
      }
      for (const contractName in authorization.approvals) {
        approvals[contractName] = {
          ...approvals[contractName],
          ...authorization.approvals[contractName]
        }
      }

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [address]: { allowances, approvals }
        }
      }
    }
    case FETCH_AUTHORIZATION_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.payload.transaction

      switch (transaction.actionType) {
        case ALLOW_TOKEN_SUCCESS: {
          const {
            address,
            amount,
            contractName,
            tokenContractName
          } = transaction.payload
          const addressState = state.data[address] || EMPTY_ADDRESS_STATE

          const allowances = {
            ...addressState.allowances,
            [contractName]: {
              ...addressState.allowances[contractName],
              [tokenContractName]: amount
            }
          }

          return {
            ...state,
            data: {
              ...state.data,
              [address]: { approvals: {}, ...state.data[address], allowances }
            }
          }
        }
        case APPROVE_TOKEN_SUCCESS: {
          const {
            address,
            isApproved,
            contractName,
            tokenContractName
          } = transaction.payload
          const addressState = state.data[address] || EMPTY_ADDRESS_STATE

          const approvals = {
            ...addressState.approvals,
            [contractName]: {
              ...addressState.approvals[contractName],
              [tokenContractName]: isApproved
            }
          }

          return {
            ...state,
            data: {
              ...state.data,
              [address]: { allowances: {}, ...state.data[address], approvals }
            }
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}
