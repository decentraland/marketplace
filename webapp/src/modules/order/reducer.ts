import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { Order } from './types'
import {
  FetchAccountSuccessAction,
  FETCH_ACCOUNT_SUCCESS
} from '../account/actions'
import {
  FetchOrdersRequestAction,
  FetchOrdersSuccessAction,
  FetchOrdersFailureAction,
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE
} from './actions'
import { FetchNFTSuccessAction, FETCH_NFT_SUCCESS } from '../nft/actions'

export type OrderState = {
  data: Record<string, Order>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

type OrderReducerAction =
  | FetchOrdersRequestAction
  | FetchOrdersSuccessAction
  | FetchOrdersFailureAction
  | FetchAccountSuccessAction
  | FetchNFTSuccessAction

export function orderReducer(
  state: OrderState = INITIAL_STATE,
  action: OrderReducerAction
): OrderState {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_ACCOUNT_SUCCESS:
    case FETCH_ORDERS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.orders.reduce((obj, order) => {
            obj[order.id] = order
            return obj
          }, {} as Record<string, Order>)
        },
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case FETCH_ORDERS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    case FETCH_NFT_SUCCESS: {
      const { order } = action.payload
      if (order) {
        return {
          ...state,
          data: {
            ...state.data,
            [order.id]: order
          }
        }
      }
      return state
    }
    default:
      return state
  }
}
