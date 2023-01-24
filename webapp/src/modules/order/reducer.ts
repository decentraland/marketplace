import { Order } from '@dcl/schemas'
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
  FETCH_NFTS_FAILURE,
  FetchNFTSuccessAction,
  FETCH_NFT_SUCCESS
} from '../nft/actions'
import {
  AcceptRentalListingSuccessAction,
  ACCEPT_RENTAL_LISTING_SUCCESS
} from '../rental/actions'
import {
  CancelOrderFailureAction,
  CancelOrderRequestAction,
  CancelOrderSuccessAction,
  CANCEL_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CreateOrderFailureAction,
  CreateOrderRequestAction,
  CreateOrderSuccessAction,
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  ExecuteOrderFailureAction,
  ExecuteOrderRequestAction,
  ExecuteOrderSuccessAction,
  ExecuteOrderWithCardFailureAction,
  ExecuteOrderWithCardRequestAction,
  ExecuteOrderWithCardSuccessAction,
  EXECUTE_ORDER_FAILURE,
  EXECUTE_ORDER_REQUEST,
  EXECUTE_ORDER_SUCCESS,
  EXECUTE_ORDER_WITH_CARD_FAILURE,
  EXECUTE_ORDER_WITH_CARD_REQUEST,
  EXECUTE_ORDER_WITH_CARD_SUCCESS
} from './actions'

export type OrderState = {
  data: Record<string, Order>
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: OrderState = {
  data: {},
  loading: [],
  error: null
}

type OrderReducerAction =
  | FetchNFTsRequestAction
  | FetchNFTsSuccessAction
  | FetchNFTsFailureAction
  | FetchNFTSuccessAction
  | CreateOrderRequestAction
  | CreateOrderFailureAction
  | CreateOrderSuccessAction
  | ExecuteOrderRequestAction
  | ExecuteOrderFailureAction
  | ExecuteOrderSuccessAction
  | ExecuteOrderWithCardRequestAction
  | ExecuteOrderWithCardFailureAction
  | ExecuteOrderWithCardSuccessAction
  | CancelOrderRequestAction
  | CancelOrderFailureAction
  | CancelOrderSuccessAction
  | AcceptRentalListingSuccessAction

export function orderReducer(
  state: OrderState = INITIAL_STATE,
  action: OrderReducerAction
): OrderState {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
    case EXECUTE_ORDER_REQUEST:
    case EXECUTE_ORDER_WITH_CARD_REQUEST:
    case CANCEL_ORDER_REQUEST:
    case FETCH_NFTS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case CREATE_ORDER_SUCCESS:
    case EXECUTE_ORDER_SUCCESS:
    case EXECUTE_ORDER_WITH_CARD_SUCCESS:
    case CANCEL_ORDER_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case FETCH_NFTS_SUCCESS: {
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
    case CREATE_ORDER_FAILURE:
    case EXECUTE_ORDER_FAILURE:
    case EXECUTE_ORDER_WITH_CARD_FAILURE:
    case CANCEL_ORDER_FAILURE:
    case FETCH_NFTS_FAILURE: {
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
          loading: loadingReducer(state.loading, action),
          data: {
            ...state.data,
            [order.id]: order
          }
        }
      }
      return state
    }
    case ACCEPT_RENTAL_LISTING_SUCCESS: {
      const { rental } = action.payload
      const newState = {
        ...state,
        data: Object.fromEntries(
          Object.entries(state.data).filter(
            ([_key, value]) =>
              !(
                value.contractAddress === rental.contractAddress &&
                value.tokenId === rental.tokenId
              )
          )
        )
      }
      return newState
    }
    default:
      return state
  }
}
