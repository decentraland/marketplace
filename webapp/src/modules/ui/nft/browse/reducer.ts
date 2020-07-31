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
  nftIds: string[]
  lastTimestamp: number
  assetCount?: number
}

const INITIAL_STATE: BrowseUIState = {
  view: undefined,
  nftIds: [],
  assetCount: undefined,
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
) {
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
        nftIds: view ? [] : [...state.nftIds]
      }
    }
    case FETCH_NFTS_REQUEST: {
      const { view } = action.payload.options
      return {
        ...state,
        nftIds: view === View.LOAD_MORE ? [...state.nftIds] : [],
        assetCount: undefined
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
            nftIds: action.payload.nfts.map(nft => nft.id),
            assetCount: action.payload.count,
            timestamp: action.payload.timestamp
          }
        }
        case View.LOAD_MORE: {
          return {
            ...state,
            nfts: [...state.nftIds, ...action.payload.nfts.map(nft => nft.id)],
            assetCount: action.payload.count,
            timestamp: action.payload.timestamp
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
