import {
  BULK_PICK_SUCCESS,
  BulkPickUnpickSuccessAction,
  CREATE_LIST_SUCCESS,
  CreateListSuccessAction,
  DELETE_LIST_SUCCESS,
  DeleteListSuccessAction,
  FETCH_FAVORITED_ITEMS_REQUEST,
  FETCH_FAVORITED_ITEMS_SUCCESS,
  FETCH_LISTS_REQUEST,
  FETCH_LISTS_SUCCESS,
  FetchFavoritedItemsRequestAction,
  FetchFavoritedItemsSuccessAction,
  FetchListsRequestAction,
  FetchListsSuccessAction
} from '../../favorites/actions'
import {
  FetchItemsRequestAction,
  FetchItemsSuccessAction,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS
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
  listIds: string[]
  itemIds: string[]
  catalogIds: string[]
  lastTimestamp: number
  count?: number
}

export const INITIAL_STATE: BrowseUIState = {
  view: undefined,
  page: undefined,
  nftIds: [],
  listIds: [],
  itemIds: [],
  catalogIds: [],
  count: undefined,
  lastTimestamp: 0
}

type UIReducerAction =
  | SetViewAction
  | FetchNFTsRequestAction
  | FetchNFTsSuccessAction
  | BrowseAction
  | FetchItemsRequestAction
  | FetchItemsSuccessAction
  | FetchFavoritedItemsRequestAction
  | FetchFavoritedItemsSuccessAction
  | FetchListsSuccessAction
  | FetchListsRequestAction
  | DeleteListSuccessAction
  | CreateListSuccessAction
  | BulkPickUnpickSuccessAction

export function browseReducer(
  state: BrowseUIState = INITIAL_STATE,
  action: UIReducerAction
): BrowseUIState {
  switch (action.type) {
    case SET_VIEW: {
      if (action.payload.view === state.view) {
        return state
      }
      return {
        ...state,
        view: action.payload.view,
        nftIds: [],
        itemIds: [],
        count: undefined,
        page: undefined
      }
    }

    case BULK_PICK_SUCCESS:
      const { ownerRemovedFromCurrentList } = action.payload

      return {
        ...state,
        count:
          state.count !== undefined && ownerRemovedFromCurrentList
            ? --state.count
            : state.count
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
      if (view === state.view) {
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
      return state
    }

    case FETCH_NFTS_REQUEST:
    case FETCH_ITEMS_REQUEST: {
      const key = action.type === FETCH_NFTS_REQUEST ? 'nftIds' : 'itemIds'
      const { view, page } =
        action.type === FETCH_NFTS_REQUEST
          ? action.payload.options
          : action.payload

      const isDifferentView = view !== state.view
      if (
        isDifferentView &&
        !(view === View.ATLAS && state.view === View.MARKET) // exception for atlas request on the view market, it should not override the nftIds
      ) {
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

    case FETCH_FAVORITED_ITEMS_REQUEST:
      if (action.payload.forceLoadMore) {
        return state
      }

      return {
        ...state,
        itemIds: isLoadingMoreResults(state, action.payload.options.page)
          ? state.itemIds
          : []
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

    case CREATE_LIST_SUCCESS: {
      const { list } = action.payload
      return {
        ...state,
        count: (state.count ?? 0) + 1,
        listIds: [list.id, ...state.listIds]
      }
    }

    case FETCH_LISTS_REQUEST: {
      const { page } = action.payload.options
      return {
        ...state,
        listIds: page === 1 ? [] : state.listIds
      }
    }

    case FETCH_LISTS_SUCCESS: {
      const {
        lists,
        total,
        options: { page }
      } = action.payload
      const newListIds = lists.map(list => list.id)
      const listIds = isLoadingMoreResults(state, page)
        ? [...state.listIds, ...newListIds]
        : newListIds

      return {
        ...state,
        listIds,
        page,
        count: total
      }
    }

    case DELETE_LIST_SUCCESS: {
      const { list } = action.payload

      return {
        ...state,
        listIds: state.listIds.filter(listId => listId !== list.id)
      }
    }

    default:
      return state
  }
}
