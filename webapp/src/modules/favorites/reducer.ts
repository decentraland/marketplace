import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
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
  CANCEL_PICK_ITEM_AS_FAVORITE
} from './actions'
import { FavoritesData } from './types'

export type FavoritesState = {
  data: Record<string, FavoritesData>
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: FavoritesState = {
  data: {},
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

export function favoritesReducer(
  state = INITIAL_STATE,
  action: FavoritesReducerAction
): FavoritesState {
  switch (action.type) {
    case PICK_ITEM_AS_FAVORITE_REQUEST:
    case UNPICK_ITEM_AS_FAVORITE_REQUEST:
    case UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }

    case PICK_ITEM_AS_FAVORITE_SUCCESS:
    case UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS: {
      const { item } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          [item.id]: {
            pickedByUser: true,
            count: state.data[item.id].count + 1
          }
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case UNPICK_ITEM_AS_FAVORITE_SUCCESS: {
      const { item } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          [item.id]: {
            pickedByUser: false,
            count: state.data[item.id].count - 1
          }
        },
        loading: loadingReducer(state.loading, action)
      }
    }

    case PICK_ITEM_AS_FAVORITE_FAILURE:
    case UNPICK_ITEM_AS_FAVORITE_FAILURE:
    case UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE: {
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
