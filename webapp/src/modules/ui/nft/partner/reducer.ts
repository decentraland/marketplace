import {
  FetchNFTsSuccessAction,
  FETCH_NFTS_SUCCESS
} from '../../../nft/actions'
import { View } from '../../types'

export type PartnerUIState = {
  [View.PARTNERS_SUPER_RARE]: string[]
  [View.PARTNERS_MAKERS_PLACE]: string[]
}

const INITIAL_STATE: PartnerUIState = {
  [View.PARTNERS_SUPER_RARE]: [],
  [View.PARTNERS_MAKERS_PLACE]: []
}

type UIReducerAction = FetchNFTsSuccessAction

export function partnerReducer(
  state: PartnerUIState = INITIAL_STATE,
  action: UIReducerAction
) {
  switch (action.type) {
    case FETCH_NFTS_SUCCESS: {
      const nftIds = action.payload.nfts.map(nft => nft.id)

      switch (action.payload.options.view) {
        case View.PARTNERS_SUPER_RARE: {
          return {
            ...state,
            [View.PARTNERS_SUPER_RARE]: nftIds
          }
        }
        case View.PARTNERS_MAKERS_PLACE: {
          return {
            ...state,
            [View.PARTNERS_MAKERS_PLACE]: nftIds
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
