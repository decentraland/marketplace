import { FetchNFTsSuccessAction, FETCH_NFTS_SUCCESS } from '../nft/actions'
import { View } from './types'

export type UIState = {
  nftIds: string[]
}

const INITIAL_STATE: UIState = {
  nftIds: []
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
        default:
          return state
      }
    }
    default:
      return state
  }
}
