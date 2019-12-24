import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'

import { Wallet } from './types'
import {
  ConnectWalletRequestAction,
  ConnectWalletSuccessAction,
  ConnectWalletFailureAction,
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE
} from './actions'

export type WalletState = {
  data: Wallet | null
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: WalletState = {
  data: null,
  loading: [],
  error: null
}

export type WalletReducerAction =
  | ConnectWalletRequestAction
  | ConnectWalletSuccessAction
  | ConnectWalletFailureAction

export function walletReducer(
  state: WalletState = INITIAL_STATE,
  action: WalletReducerAction
): WalletState {
  switch (action.type) {
    case CONNECT_WALLET_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case CONNECT_WALLET_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: action.payload.wallet
      }
    case CONNECT_WALLET_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    default:
      return state
  }
}
