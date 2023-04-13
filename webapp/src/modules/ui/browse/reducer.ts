import {
  FETCH_FAVORITED_ITEMS_SUCCESS,
  FetchFavoritedItemsSuccessAction
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
import { Section } from '../../vendor/decentraland'
import { SetViewAction, SET_VIEW } from '../actions'
import { View } from '../types'

export type BrowseUIState = {
  view?: View
  nftIds: string[]
  itemIds: string[]
  lastTimestamp: number
  count?: number
}

export const INITIAL_STATE: BrowseUIState = {
  view: undefined,
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

export function browseReducer(
  state: BrowseUIState = INITIAL_STATE,
  action: UIReducerAction
): BrowseUIState {
  switch (action.type) {
    case SET_VIEW: {
      return {
        ...state,
        view: action.payload.view
      }
    }

    case BROWSE: {
      const { view } = action.payload.options
      return {
        ...state,
        nftIds: view ? [] : [...state.nftIds]
      }
    }

    case FETCH_NFTS_REQUEST: {
      const { view } = action.payload.options
      switch (view) {
        case View.ATLAS:
          return state
        case View.LOAD_MORE:
          return {
            ...state,
            nftIds: [...state.nftIds],
            count: undefined
          }
        default:
          return {
            ...state,
            nftIds: [],
            count: undefined
          }
      }
    }

    case FETCH_NFTS_SUCCESS: {
      if (action.payload.timestamp < state.lastTimestamp) {
        return state
      }
      const view = action.payload.options.view
      switch (view) {
        case View.MARKET:
        case View.CURRENT_ACCOUNT:
        case View.ACCOUNT: {
          return {
            ...state,
            view,
            nftIds: action.payload.nfts.map(nft => nft.id),
            count: action.payload.count,
            lastTimestamp: action.payload.timestamp
          }
        }
        case View.LOAD_MORE: {
          return {
            ...state,
            nftIds: [
              ...state.nftIds,
              ...action.payload.nfts.map(nft => nft.id)
            ],
            count: action.payload.count,
            lastTimestamp: action.payload.timestamp
          }
        }
        default:
          return state
      }
    }

    case FETCH_ITEMS_REQUEST: {
      const { view } = action.payload
      switch (view) {
        case View.ATLAS:
          return state
        case View.LOAD_MORE:
          return {
            ...state,
            itemIds: [...state.itemIds],
            count: undefined
          }
        default:
          return {
            ...state,
            nftIds: [],
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
      return {
        ...state,
        count: action.payload.total
      }

    case FETCH_ITEMS_SUCCESS: {
      if (action.payload.timestamp < state.lastTimestamp) {
        return state
      }
      const view = action.payload.options.view
      const section = action.payload.options.section

      switch (view) {
        case View.MARKET:
        case View.CURRENT_ACCOUNT:
        case View.ACCOUNT: {
          return {
            ...state,
            view,
            itemIds: action.payload.items.map(item => item.id),
            count: action.payload.total,
            lastTimestamp: action.payload.timestamp
          }
        }
        case View.LISTS: {
          return {
            ...state,
            view,
            itemIds: action.payload.items.map(item => item.id),
            lastTimestamp: action.payload.timestamp
          }
        }
        case View.LOAD_MORE: {
          return {
            ...state,
            itemIds: [
              ...state.itemIds,
              ...action.payload.items.map(item => item.id)
            ],
            count:
              section === Section.LISTS ? state.count : action.payload.total,
            lastTimestamp: action.payload.timestamp
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
