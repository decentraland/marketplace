import {
  FetchNFTsSuccessAction,
  FETCH_NFTS_SUCCESS
} from '../../../nft/actions'
import { View } from '../../types'

export type HomepageUIState = {
  [View.HOME_WEARABLES]: string[]
  [View.HOME_LAND]: string[]
  [View.HOME_ENS]: string[]
}

const INITIAL_STATE: HomepageUIState = {
  [View.HOME_WEARABLES]: [],
  [View.HOME_LAND]: [],
  [View.HOME_ENS]: []
}

type UIReducerAction = FetchNFTsSuccessAction

export function homepageReducer(
  state: HomepageUIState = INITIAL_STATE,
  action: UIReducerAction
) {
  switch (action.type) {
    case FETCH_NFTS_SUCCESS: {
      const nftIds = action.payload.nfts.map(nft => nft.id)

      switch (action.payload.options.view) {
        case View.HOME_WEARABLES: {
          return {
            ...state,
            [View.HOME_WEARABLES]: nftIds
          }
        }
        case View.HOME_LAND: {
          return {
            ...state,
            [View.HOME_LAND]: nftIds
          }
        }
        case View.HOME_ENS: {
          return {
            ...state,
            [View.HOME_ENS]: nftIds
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
