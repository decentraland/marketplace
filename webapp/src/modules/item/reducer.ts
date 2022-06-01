import { Item } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  BuyItemFailureAction,
  BuyItemRequestAction,
  BuyItemSuccessAction,
  BUY_ITEM_FAILURE,
  BUY_ITEM_REQUEST,
  BUY_ITEM_SUCCESS,
  FetchItemsFailureAction,
  FetchItemsRequestAction,
  FetchItemsSuccessAction,
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
  FetchItemFailureAction,
  FetchItemRequestAction,
  FetchItemSuccessAction,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_REQUEST,
  FETCH_ITEM_SUCCESS,
  FETCH_TRENDING_ITEMS_SUCCESS,
  FetchTrendingItemsRequestAction,
  FetchTrendingItemsSuccessAction,
  FetchTrendingItemsFailureAction,
  FETCH_TRENDING_ITEMS_REQUEST,
  FETCH_TRENDING_ITEMS_FAILURE
} from './actions'

export type ItemState = {
  data: Record<string, Item>
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: ItemState = {
  data: {},
  loading: [],
  error: null
}

type ItemReducerAction =
  | FetchTrendingItemsRequestAction
  | FetchTrendingItemsSuccessAction
  | FetchTrendingItemsFailureAction
  | FetchItemsRequestAction
  | FetchItemsSuccessAction
  | FetchItemsFailureAction
  | FetchItemFailureAction
  | FetchItemRequestAction
  | FetchItemSuccessAction
  | BuyItemRequestAction
  | BuyItemSuccessAction
  | BuyItemFailureAction

export function itemReducer(
  state = INITIAL_STATE,
  action: ItemReducerAction
): ItemState {
  switch (action.type) {
    case BUY_ITEM_REQUEST:
    case BUY_ITEM_SUCCESS:
    case FETCH_ITEMS_REQUEST:
    case FETCH_TRENDING_ITEMS_REQUEST:
    case FETCH_ITEM_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_TRENDING_ITEMS_SUCCESS:
    case FETCH_ITEMS_SUCCESS: {
      const { items } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          ...items.reduce((obj, item) => {
            obj[item.id] = item
            return obj
          }, {} as Record<string, Item>)
        },
        error: null
      }
    }
    case FETCH_ITEM_SUCCESS: {
      const { item } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [item.id]: { ...item }
        },
        error: null
      }
    }

    case BUY_ITEM_FAILURE:
    case FETCH_ITEMS_FAILURE:
    case FETCH_TRENDING_ITEMS_FAILURE:
    case FETCH_ITEM_FAILURE: {
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
