import {
  FETCH_FAVORITED_ITEMS_SUCCESS,
  FetchFavoritedItemsSuccessAction,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS,
  UNPICK_ITEM_AS_FAVORITE_SUCCESS,
  UndoUnpickingItemAsFavoriteSuccessAction,
  UnpickItemAsFavoriteSuccessAction
} from '../../favorites/actions'
import {
  FetchItemsRequestAction,
  FetchItemsSuccessAction,
  FetchTrendingItemsSuccessAction,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
  FETCH_TRENDING_ITEMS_SUCCESS
} from '../../item/actions'
import {
  FetchNFTsRequestAction,
  FetchNFTsSuccessAction,
  FETCH_NFTS_REQUEST,
  FETCH_NFTS_SUCCESS
} from '../../nft/actions'
import { BrowseAction, BROWSE } from '../../routing/actions'
import { SetViewAction, SET_VIEW } from '../actions'
import { View } from '../types'
import { isLoadingMoreResults } from './utils'

export type BrowseUIState = {
  view?: View
  page?: number
  nftIds: string[]
  itemIds: string[]
  lastTimestamp: number
  count?: number
}

export const INITIAL_STATE: BrowseUIState = {
  view: undefined,
  page: undefined,
  nftIds: [],
  itemIds: [],
  count: undefined,
  lastTimestamp: 0
}

type UIReducerAction =
  | SetViewAction
  | FetchNFTsRequestAction
  | FetchNFTsSuccessAction
  | BrowseAction
  | FetchTrendingItemsSuccessAction
  | FetchItemsRequestAction
  | FetchItemsSuccessAction
  | FetchFavoritedItemsSuccessAction
  | UnpickItemAsFavoriteSuccessAction
  | UndoUnpickingItemAsFavoriteSuccessAction

export function browseReducer(
  state: BrowseUIState = INITIAL_STATE,
  action: UIReducerAction
): BrowseUIState {
  switch (action.type) {
    case SET_VIEW: {
      return {
        ...state,
        view: action.payload.view,
        nftIds: [],
        itemIds: [],
        count: undefined,
        page: undefined
      }
    }

    case UNPICK_ITEM_AS_FAVORITE_SUCCESS:
      return {
        ...state,
        count: state.count !== undefined ? --state.count : state.count
      }

    case UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS:
      return {
        ...state,
        count: state.count !== undefined ? ++state.count : state.count
      }

    case BROWSE: {
      const { view } = action.payload.options
      return {
        ...state,
        nftIds: view ? [] : [...state.nftIds]
      }
    }

    case FETCH_NFTS_SUCCESS: {
      const {
        timestamp,
        nfts,
        count,
        options: { page, view }
      } = action.payload
      if (timestamp < state.lastTimestamp) {
        return state
      }
      const newNftIds = nfts.map(nft => nft.id)
      const nftIds = isLoadingMoreResults(state, page)
        ? [...state.nftIds, ...newNftIds]
        : newNftIds
      switch (view) {
        case View.MARKET:
        case View.CURRENT_ACCOUNT:
        case View.ACCOUNT: {
          return {
            ...state,
            view,
            page,
            nftIds,
            count: count,
            lastTimestamp: timestamp
          }
        }
        default:
          return state
      }
    }

    case FETCH_NFTS_REQUEST:
    case FETCH_ITEMS_REQUEST: {
      const key = action.type === FETCH_NFTS_REQUEST ? 'nftIds' : 'itemIds'
      const { view, page } =
        action.type === FETCH_NFTS_REQUEST
          ? action.payload.options
          : action.payload

      const isDifferentView = view !== state.view
      if (isDifferentView) {
        return {
          ...state,
          [key]: [],
          count: undefined
        }
      }

      const elements = isLoadingMoreResults(state, page) ? [...state[key]] : []
      switch (view) {
        case View.ATLAS:
          return state
        case View.LISTS:
        case View.CURRENT_ACCOUNT:
        case View.ACCOUNT:
        case View.MARKET:
          return { ...state, [key]: elements, count: undefined }
        default:
          return {
            ...state,
            [key]: [],
            count: undefined
          }
      }
    }

    case FETCH_TRENDING_ITEMS_SUCCESS:
      return {
        ...state,
        itemIds: action.payload.items.map(item => item.id)
      }

    case FETCH_FAVORITED_ITEMS_SUCCESS:
      const {
        timestamp,
        options: { page },
        items,
        forceLoadMore,
        total
      } = action.payload
      if (timestamp < state.lastTimestamp) {
        return state
      }

      const newItemIds = items.map(item => item.id)
      const itemIds =
        isLoadingMoreResults(state, page) || forceLoadMore
          ? [...state.itemIds, ...newItemIds]
          : newItemIds

      return {
        ...state,
        itemIds,
        page: forceLoadMore ? state.page : page,
        count: total
      }

    case FETCH_ITEMS_SUCCESS: {
      const {
        timestamp,
        items,
        total,
        options: { page, view }
      } = action.payload
      if (timestamp < state.lastTimestamp) {
        return state
      }

      const newItemIds = items.map(item => item.id)
      const itemIds = isLoadingMoreResults(state, page)
        ? [...state.itemIds, ...newItemIds]
        : newItemIds

      switch (view) {
        case View.MARKET:
        case View.CURRENT_ACCOUNT:
        case View.ACCOUNT: {
          return {
            ...state,
            view,
            page,
            itemIds,
            count: total,
            lastTimestamp: timestamp
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}
