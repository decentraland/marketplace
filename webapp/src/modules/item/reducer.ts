import { Item } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
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
  FETCH_ITEM_SUCCESS
} from './actions'

export type ItemState = {
  data: Record<string, Item>
  loading: LoadingState
  total: number // TODO: Should we move this elsewhere? UI maybe?
  error: string | null
}

const INITIAL_STATE: ItemState = {
  data: {},
  loading: [],
  total: 0,
  error: null
}

type ItemReducerAction =
  | FetchItemsRequestAction
  | FetchItemsSuccessAction
  | FetchItemsFailureAction
  | FetchItemFailureAction
  | FetchItemRequestAction
  | FetchItemSuccessAction

export function itemReducer(
  state = INITIAL_STATE,
  action: ItemReducerAction
): ItemState {
  switch (action.type) {
    case FETCH_ITEMS_REQUEST:
    case FETCH_ITEM_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_ITEMS_SUCCESS: {
      const { items, total } = action.payload
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
        total,
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
    case FETCH_ITEMS_FAILURE:
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
