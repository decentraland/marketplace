import { FetchNFTsSuccessAction, FETCH_NFTS_SUCCESS } from '../nft/actions'
import { View } from './types'

export type UIState = {
  nftIds: string[]
  homepageWearableIds: string[]
  homepageLandIds: string[]
  homepageENSIds: string[]
}

const INITIAL_STATE: UIState = {
  nftIds: [],
  homepageWearableIds: [],
  homepageLandIds: [],
  homepageENSIds: []
}

type UIReducerAction = FetchNFTsSuccessAction

export function uiReducer(
  state: UIState = INITIAL_STATE,
  action: UIReducerAction
) {
  switch (action.type) {
    case FETCH_NFTS_SUCCESS: {
      switch (action.payload.options.view) {
        case View.MARKET:
        case View.ACCOUNT: {
          return {
            ...state,
            nftIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case View.LOAD_MORE: {
          return {
            ...state,
            nftIds: [...state.nftIds, ...action.payload.nfts.map(nft => nft.id)]
          }
        }
        case View.HOME_WEARABLES: {
          return {
            ...state,
            homepageWearableIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case View.HOME_LAND: {
          return {
            ...state,
            homepageLandIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case View.HOME_ENS: {
          return {
            ...state,
            homepageENSIds: action.payload.nfts.map(nft => nft.id)
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
