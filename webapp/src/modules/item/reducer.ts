import isEqual from 'lodash/isEqual'
import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FETCH_FAVORITED_ITEMS_SUCCESS,
  FETCH_LISTS_SUCCESS,
  FetchFavoritedItemsSuccessAction,
  FetchListsSuccessAction,
  GET_LIST_SUCCESS,
  GetListSuccessAction
} from '../favorites/actions'
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
  FETCH_TRENDING_ITEMS_FAILURE,
  BUY_ITEM_WITH_CARD_REQUEST,
  BUY_ITEM_WITH_CARD_SUCCESS,
  BuyItemWithCardFailureAction,
  BuyItemWithCardRequestAction,
  BuyItemWithCardSuccessAction,
  BUY_ITEM_WITH_CARD_FAILURE,
  CLEAR_ITEM_ERRORS,
  ClearItemErrorsAction,
  FETCH_COLLECTION_ITEMS_SUCCESS,
  FetchCollectionItemsRequestAction,
  FetchCollectionItemsSuccessAction,
  FetchCollectionItemsFailureAction,
  FETCH_COLLECTION_ITEMS_REQUEST,
  FETCH_COLLECTION_ITEMS_FAILURE,
  BUY_ITEM_CROSS_CHAIN_SUCCESS,
  BUY_ITEM_CROSS_CHAIN_REQUEST,
  BuyItemCrossChainRequestAction,
  BuyItemCrossChainFailureAction,
  BuyItemCrossChainSuccessAction,
  BUY_ITEM_CROSS_CHAIN_FAILURE
} from './actions'
import { Item } from './types'

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
  | FetchFavoritedItemsSuccessAction
  | GetListSuccessAction
  | FetchListsSuccessAction
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
  | BuyItemWithCardRequestAction
  | BuyItemWithCardSuccessAction
  | BuyItemWithCardFailureAction
  | ClearItemErrorsAction
  | FetchCollectionItemsRequestAction
  | FetchCollectionItemsSuccessAction
  | FetchCollectionItemsFailureAction
  | BuyItemCrossChainRequestAction
  | BuyItemCrossChainFailureAction
  | BuyItemCrossChainSuccessAction

export function itemReducer(state = INITIAL_STATE, action: ItemReducerAction): ItemState {
  switch (action.type) {
    case BUY_ITEM_REQUEST:
    case BUY_ITEM_SUCCESS:
    case BUY_ITEM_CROSS_CHAIN_REQUEST:
    case BUY_ITEM_CROSS_CHAIN_SUCCESS:
    case BUY_ITEM_WITH_CARD_REQUEST:
    case BUY_ITEM_WITH_CARD_SUCCESS:
    case FETCH_ITEMS_REQUEST:
    case FETCH_TRENDING_ITEMS_REQUEST:
    case FETCH_COLLECTION_ITEMS_REQUEST:
    case FETCH_ITEM_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_TRENDING_ITEMS_SUCCESS:
    case FETCH_FAVORITED_ITEMS_SUCCESS:
    case GET_LIST_SUCCESS:
    case FETCH_LISTS_SUCCESS:
    case FETCH_COLLECTION_ITEMS_SUCCESS:
    case FETCH_ITEMS_SUCCESS: {
      const { items } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          ...items.reduce(
            (obj, item) => {
              if (!state.data[item.id] || !isEqual(state.data[item.id], item)) {
                obj[item.id] = { ...state.data[item.id], ...item }
              }
              return obj
            },
            {} as Record<string, Item>
          )
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
          [item.id]: { ...state.data[item.id], ...item }
        },
        error: null
      }
    }

    case BUY_ITEM_FAILURE:
    case BUY_ITEM_CROSS_CHAIN_FAILURE:
    case BUY_ITEM_WITH_CARD_FAILURE:
    case FETCH_COLLECTION_ITEMS_FAILURE:
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
    case CLEAR_ITEM_ERRORS: {
      return {
        ...state,
        error: null
      }
    }
    default:
      return state
  }
}
