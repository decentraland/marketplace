import {
  FetchItemsSuccessAction,
  FETCH_ITEMS_SUCCESS
} from '../../../item/actions'
import {
  FetchNFTsSuccessAction,
  FETCH_NFTS_SUCCESS
} from '../../../nft/actions'
import { View } from '../../types'

export type HomepageUIState = {
  [View.HOME_NEW_ITEMS]: string[]
  [View.HOME_SOLD_ITEMS]: string[]
  [View.HOME_WEARABLES]: string[]
  [View.HOME_LAND]: string[]
  [View.HOME_ENS]: string[]
}

const INITIAL_STATE: HomepageUIState = {
  [View.HOME_NEW_ITEMS]: [],
  [View.HOME_SOLD_ITEMS]: [],
  [View.HOME_WEARABLES]: [],
  [View.HOME_LAND]: [],
  [View.HOME_ENS]: []
}

type UIReducerAction = FetchItemsSuccessAction | FetchNFTsSuccessAction

export function homepageReducer(
  state: HomepageUIState = INITIAL_STATE,
  action: UIReducerAction
) {
  switch (action.type) {
    case FETCH_ITEMS_SUCCESS: {
      const { items, options } = action.payload
      const itemIds = items.map(items => items.id)

      switch (options.view) {
        case View.HOME_NEW_ITEMS: {
          return {
            ...state,
            [View.HOME_NEW_ITEMS]: itemIds
          }
        }
        case View.HOME_SOLD_ITEMS: {
          return {
            ...state,
            [View.HOME_SOLD_ITEMS]: itemIds
          }
        }
        default:
          return state
      }
    }
    case FETCH_NFTS_SUCCESS: {
      const { nfts, options } = action.payload
      const nftIds = nfts.map(nft => nft.id)

      switch (options.view) {
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
