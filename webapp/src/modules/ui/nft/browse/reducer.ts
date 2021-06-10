import {
  FetchNFTsSuccessAction,
  FETCH_NFTS_SUCCESS,
  FetchNFTsRequestAction,
  FETCH_NFTS_REQUEST
} from '../../../nft/actions'
import { BROWSE, BrowseAction } from '../../../routing/actions'
import { SET_VIEW, SetViewAction } from '../../actions'
import { View } from '../../types'

export type BrowseUIState = {
  view?: View
  ids: string[]
  lastTimestamp: number
  count?: number
}

const INITIAL_STATE: BrowseUIState = {
  view: undefined,
  ids: [],
  count: undefined,
  lastTimestamp: 0
}

type UIReducerAction =
  | SetViewAction
  | FetchNFTsRequestAction
  | FetchNFTsSuccessAction
  | BrowseAction

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
      const { view } = action.payload.searchOptions
      return {
        ...state,
        ids: view ? [] : [...state.ids]
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
            ids: [...state.ids],
            count: undefined
          }
        default:
          return {
            ...state,
            ids: [],
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
        case View.ACCOUNT: {
          return {
            ...state,
            view,
            ids: action.payload.nfts.map(nft => nft.id),
            count: action.payload.count,
            lastTimestamp: action.payload.timestamp
          }
        }
        case View.LOAD_MORE: {
          return {
            ...state,
            ids: [...state.ids, ...action.payload.nfts.map(nft => nft.id)],
            count: action.payload.count,
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
