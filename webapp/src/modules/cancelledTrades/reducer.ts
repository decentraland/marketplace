import { LoadingState, loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { DISCONNECT_WALLET_SUCCESS, DisconnectWalletSuccessAction } from 'decentraland-dapps/dist/modules/wallet/actions'
import { CancelledTrade } from '../vendor/decentraland/cancelledTrades/types'
import {
  FETCH_CANCELLED_TRADES_FAILURE,
  FETCH_CANCELLED_TRADES_REQUEST,
  FETCH_CANCELLED_TRADES_SUCCESS,
  FetchCancelledTradesFailureAction,
  FetchCancelledTradesRequestAction,
  FetchCancelledTradesSuccessAction
} from './actions'

export type CancelledTradesState = {
  address: string | null
  data: CancelledTrade[]
  total: number
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: CancelledTradesState = {
  address: null,
  data: [],
  total: 0,
  loading: [],
  error: null
}

type CancelledTradesReducerAction =
  | FetchCancelledTradesRequestAction
  | FetchCancelledTradesSuccessAction
  | FetchCancelledTradesFailureAction
  | DisconnectWalletSuccessAction

export function cancelledTradesReducer(state = INITIAL_STATE, action: CancelledTradesReducerAction): CancelledTradesState {
  switch (action.type) {
    case FETCH_CANCELLED_TRADES_REQUEST:
      return { ...state, loading: loadingReducer(state.loading, action) }
    case FETCH_CANCELLED_TRADES_SUCCESS:
      return {
        ...state,
        address: action.payload.address.toLowerCase(),
        data: action.payload.trades,
        total: action.payload.total,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    case FETCH_CANCELLED_TRADES_FAILURE:
      return { ...state, loading: loadingReducer(state.loading, action), error: action.payload.error }
    case DISCONNECT_WALLET_SUCCESS:
      return INITIAL_STATE
    default:
      return state
  }
}
