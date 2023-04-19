import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FETCH_ITEM_SUCCESS,
  FETCH_ITEMS_SUCCESS,
  FetchItemsSuccessAction,
  FetchItemSuccessAction
} from '../item/actions'
import {
  PickItemAsFavoriteFailureAction,
  PickItemAsFavoriteRequestAction,
  PickItemAsFavoriteSuccessAction,
  PICK_ITEM_AS_FAVORITE_FAILURE,
  PICK_ITEM_AS_FAVORITE_REQUEST,
  PICK_ITEM_AS_FAVORITE_SUCCESS,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS,
  UnpickItemAsFavoriteFailureAction,
  UnpickItemAsFavoriteRequestAction,
  UnpickItemAsFavoriteSuccessAction,
  UNPICK_ITEM_AS_FAVORITE_FAILURE,
  UNPICK_ITEM_AS_FAVORITE_REQUEST,
  UNPICK_ITEM_AS_FAVORITE_SUCCESS,
  UndoUnpickingItemAsFavoriteRequestAction,
  UndoUnpickingItemAsFavoriteSuccessAction,
  UndoUnpickingItemAsFavoriteFailureAction,
  CancelPickItemAsFavoriteAction,
  CANCEL_PICK_ITEM_AS_FAVORITE,
  FETCH_FAVORITED_ITEMS_REQUEST,
  FetchFavoritedItemsRequestAction,
  FetchFavoritedItemsSuccessAction,
  FetchFavoritedItemsFailureAction,
  FETCH_FAVORITED_ITEMS_FAILURE,
  FETCH_FAVORITED_ITEMS_SUCCESS
} from './actions'
import { FavoritesData } from './types'

export type FavoritesState = {
  data: { items: Record<string, FavoritesData | undefined>; total: number }
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: FavoritesState = {
  data: { items: {}, total: 0 },
  loading: [],
  error: null
}

type FavoritesReducerAction =
  | PickItemAsFavoriteRequestAction
  | PickItemAsFavoriteSuccessAction
  | PickItemAsFavoriteFailureAction
  | CancelPickItemAsFavoriteAction
  | UnpickItemAsFavoriteRequestAction
  | UnpickItemAsFavoriteSuccessAction
  | UnpickItemAsFavoriteFailureAction
  | UndoUnpickingItemAsFavoriteRequestAction
  | UndoUnpickingItemAsFavoriteSuccessAction
  | UndoUnpickingItemAsFavoriteFailureAction
  | FetchFavoritedItemsRequestAction
  | FetchFavoritedItemsSuccessAction
  | FetchFavoritedItemsFailureAction
  | FetchItemsSuccessAction
  | FetchItemSuccessAction

export function favoritesReducer(
  state = INITIAL_STATE,
  action: FavoritesReducerAction
): FavoritesState {
  switch (action.type) {
    case PICK_ITEM_AS_FAVORITE_REQUEST:
    case UNPICK_ITEM_AS_FAVORITE_REQUEST:
    case UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST:
    case FETCH_FAVORITED_ITEMS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }

    case PICK_ITEM_AS_FAVORITE_SUCCESS:
    case UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS: {
      const { item } = action.payload
      const currentCount = state.data.items[item.id]?.count ?? 0
      return {
        ...state,
        data: {
          ...state.data,
          items: {
            ...state.data.items,
            [item.id]: {
              pickedByUser: true,
              count: currentCount + 1
            }
          },
          total: state.data.total + 1
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case UNPICK_ITEM_AS_FAVORITE_SUCCESS: {
      const { item } = action.payload
      const currentCount = state.data.items[item.id]?.count ?? 0
      return {
        ...state,
        data: {
          ...state.data,
          items: {
            ...state.data.items,
            [item.id]: {
              pickedByUser: false,
              count: Math.max(0, currentCount - 1)
            }
          },
          total: Math.max(0, state.data.total - 1)
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case FETCH_ITEMS_SUCCESS: {
      const { items } = action.payload

      return {
        ...state,
        data: {
          ...state.data,
          items: {
            ...state.data.items,
            ...Object.fromEntries(items.map(item => [item.id, item.picks]))
          }
        }
      }
    }

    case FETCH_ITEM_SUCCESS: {
      const { item } = action.payload

      return {
        ...state,
        data: {
          ...state.data,
          items: {
            ...state.data.items,
            [item.id]: item.picks
          }
        }
      }
    }

    case FETCH_FAVORITED_ITEMS_SUCCESS: {
      const { total } = action.payload

      return {
        ...state,
        data: {
          ...state.data,
          total
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case PICK_ITEM_AS_FAVORITE_FAILURE:
    case UNPICK_ITEM_AS_FAVORITE_FAILURE:
    case UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE:
    case FETCH_FAVORITED_ITEMS_FAILURE: {
      const { error } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    }

    case CANCEL_PICK_ITEM_AS_FAVORITE: {
      return {
        ...state,
        loading: [],
        error: null
      }
    }

    default:
      return state
  }
}
