import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { Order } from './types'
import {
  FetchOrdersRequestAction,
  FetchOrdersSuccessAction,
  FetchOrdersFailureAction,
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE
} from './actions'

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

export function orderReducer(
  state: OrderState = INITIAL_STATE,
  action: OrderReducerAction
) {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_ORDERS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.orders.reduce(
            (obj, order) => {
              obj[order.id] = order
              return obj
            },
            {} as Record<string, Order>
          )
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
    default:
      return state
  }
}
