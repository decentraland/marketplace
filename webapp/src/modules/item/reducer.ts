import { Item } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  buyItemFailureAction,
  buyItemRequestAction,
  buyItemSuccessAction,
  BUY_ITEM_FAILURE,
  BUY_ITEM_REQUEST,
  BUY_ITEM_SUCCESS,
  FetchItemsFailureAction,
  FetchItemsRequestAction,
  FetchItemsSuccessAction,
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS
} from './actions'

export type ItemState = {
  data: Record<string, Item>
  loading: LoadingState
  total: number
  error: string | null
}

export const INITIAL_STATE: ItemState = {
  data: {},
  loading: [],
  total: 0,
  error: null
}

type ItemReducerAction =
  | FetchItemsRequestAction
  | FetchItemsSuccessAction
  | FetchItemsFailureAction
  | buyItemRequestAction
  | buyItemSuccessAction
  | buyItemFailureAction

export function itemReducer(
  state = INITIAL_STATE,
  action: ItemReducerAction
): ItemState {
  switch (action.type) {
    case BUY_ITEM_REQUEST:
    case BUY_ITEM_SUCCESS:
    case FETCH_ITEMS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
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
    case BUY_ITEM_FAILURE:
    case FETCH_ITEMS_FAILURE: {
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
