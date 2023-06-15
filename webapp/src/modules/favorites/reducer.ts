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
import { ListDetails } from '../vendor/decentraland/favorites/types'
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
  FETCH_FAVORITED_ITEMS_SUCCESS,
  FETCH_LISTS_REQUEST,
  FetchListsRequestAction,
  FetchListsSuccessAction,
  FetchListsFailureAction,
  FETCH_LISTS_SUCCESS,
  FETCH_LISTS_FAILURE,
  DELETE_LIST_REQUEST,
  DeleteListRequestAction,
  DeleteListSuccessAction,
  DeleteListFailureAction,
  DELETE_LIST_FAILURE,
  DELETE_LIST_SUCCESS,
  GET_LIST_FAILURE,
  GetListFailureAction,
  GetListRequestAction,
  GetListSuccessAction,
  GET_LIST_SUCCESS,
  UPDATE_LIST_FAILURE,
  UPDATE_LIST_REQUEST,
  UPDATE_LIST_SUCCESS,
  UpdateListFailureAction,
  UpdateListRequestAction,
  UpdateListSuccessAction,
  CreateListRequestAction,
  CreateListSuccessAction,
  CreateListFailureAction,
  CreateListClearAction,
  CREATE_LIST_FAILURE,
  CREATE_LIST_SUCCESS,
  CREATE_LIST_REQUEST,
  CREATE_LIST_CLEAR,
  BULK_PICK_REQUEST,
  BulkPickUnpickRequestAction,
  BulkPickUnpickSuccessAction,
  BULK_PICK_SUCCESS,
  BULK_PICK_FAILURE,
  BulkPickUnpickFailureAction
} from './actions'
import { FavoritesData, List } from './types'
import { GET_LIST_REQUEST } from './actions'

export type FavoritesState = {
  data: {
    items: Record<string, FavoritesData>
    lists: Record<string, List>
  }
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: FavoritesState = {
  data: { items: {}, lists: {} },
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
  | FetchItemSuccessAction
  | FetchItemsSuccessAction
  | FetchListsRequestAction
  | FetchListsSuccessAction
  | FetchListsFailureAction
  | GetListRequestAction
  | GetListSuccessAction
  | GetListFailureAction
  | DeleteListRequestAction
  | DeleteListSuccessAction
  | DeleteListFailureAction
  | UpdateListRequestAction
  | UpdateListSuccessAction
  | UpdateListFailureAction
  | CreateListRequestAction
  | CreateListSuccessAction
  | CreateListFailureAction
  | BulkPickUnpickRequestAction
  | BulkPickUnpickSuccessAction
  | BulkPickUnpickFailureAction
  | CreateListClearAction

export function favoritesReducer(
  state = INITIAL_STATE,
  action: FavoritesReducerAction
): FavoritesState {
  switch (action.type) {
    case PICK_ITEM_AS_FAVORITE_REQUEST:
    case UNPICK_ITEM_AS_FAVORITE_REQUEST:
    case UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST:
    case FETCH_LISTS_REQUEST:
    case GET_LIST_REQUEST:
    case DELETE_LIST_REQUEST:
    case UPDATE_LIST_REQUEST:
    case CREATE_LIST_REQUEST:
    case BULK_PICK_REQUEST:
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
              count: currentCount + 1,
              createdAt: Date.now()
            }
          }
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
              ...state.data.items[item.id],
              pickedByUser: false,
              count: Math.max(0, currentCount - 1)
            }
          }
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case FETCH_ITEM_SUCCESS: {
      const { item } = action.payload

      if (!item.picks) {
        return state
      }

      return {
        ...state,
        data: {
          ...state.data,
          items: {
            ...state.data.items,
            [item.id]:
              state.data.items[item.id] && item.picks
                ? { ...state.data.items[item.id], ...item.picks }
                : item.picks
          }
        }
      }
    }

    case FETCH_ITEMS_SUCCESS:
      const { items } = action.payload

      return {
        ...state,
        data: {
          ...state.data,
          items: {
            ...state.data.items,
            ...Object.fromEntries(
              items
                .map(item => [
                  item.id,
                  state.data.items[item.id] && item.picks
                    ? {
                        ...state.data.items[item.id],
                        ...item.picks
                      }
                    : { ...item.picks }
                ])
                .filter(Boolean)
            )
          }
        },
        loading: loadingReducer(state.loading, action)
      }

    case FETCH_FAVORITED_ITEMS_SUCCESS: {
      const { items, createdAt } = action.payload

      return {
        ...state,
        data: {
          ...state.data,
          items: {
            ...state.data.items,
            ...Object.fromEntries(
              items
                .map(item => [
                  item.id,
                  state.data.items[item.id] && item.picks
                    ? {
                        ...state.data.items[item.id],
                        ...item.picks,
                        createdAt: createdAt[item.id]
                      }
                    : { ...item.picks, createdAt: createdAt[item.id] }
                ])
                .filter(Boolean)
            )
          }
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case FETCH_LISTS_SUCCESS: {
      const { lists } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          lists: {
            ...state.data.lists,
            ...Object.fromEntries(lists.map(list => [list.id, list]))
          }
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case DELETE_LIST_SUCCESS: {
      const { list } = action.payload
      const lists = { ...state.data.lists }
      delete lists[list.id]

      return {
        ...state,
        data: {
          ...state.data,
          lists
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case CREATE_LIST_CLEAR: {
      return {
        ...state,
        data: {
          ...state.data
        },
        error: null,
        loading: loadingReducer(state.loading, action)
      }
    }

    case BULK_PICK_SUCCESS: {
      const {
        isPickedByUser,
        ownerRemovedFromCurrentList,
        item
      } = action.payload

      const wasPickedBefore = state.data.items[item.id]?.pickedByUser ?? false
      const isNowPicked = isPickedByUser && !ownerRemovedFromCurrentList
      let newCount = state.data.items[item.id]?.count ?? 0
      let createdAt = state.data.items[item.id]?.createdAt

      if (wasPickedBefore && !isNowPicked) {
        newCount--
        createdAt = undefined
      } else if (!wasPickedBefore && isNowPicked) {
        newCount++
        createdAt = Date.now()
      }

      return {
        ...state,
        data: {
          ...state.data,
          items: {
            ...state.data.items,
            [item.id]: {
              pickedByUser: isNowPicked,
              count: newCount,
              createdAt
            }
          }
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case CREATE_LIST_SUCCESS:
    case UPDATE_LIST_SUCCESS:
    case GET_LIST_SUCCESS: {
      const { list } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          lists: {
            ...state.data.lists,
            [list.id]: {
              ...state.data.lists[list.id],
              itemsCount: Object.hasOwn(list, 'itemsCount')
                ? (list as ListDetails).itemsCount
                : state.data.lists[list.id]?.itemsCount ?? 0,
              ...list
            }
          }
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case CREATE_LIST_FAILURE:
    case GET_LIST_FAILURE:
    case DELETE_LIST_FAILURE:
    case UPDATE_LIST_FAILURE:
    case PICK_ITEM_AS_FAVORITE_FAILURE:
    case FETCH_LISTS_FAILURE:
    case UNPICK_ITEM_AS_FAVORITE_FAILURE:
    case UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE:
    case BULK_PICK_FAILURE:
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
