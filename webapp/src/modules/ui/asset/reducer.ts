import { combineReducers } from 'redux'
import { bidReducer as bid, BidUIState } from './bid/reducer'
import { homepageReducer as homepage, HomepageUIState } from './homepage/reducer'

export type AssetUIState = {
  homepage: HomepageUIState
  bid: BidUIState
}

export const assetReducer = combineReducers({
  homepage,
  bid
})
