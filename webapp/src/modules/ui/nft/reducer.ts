import { combineReducers } from 'redux'
import { bidReducer as bid, BidUIState } from './bid/reducer'
import { browseReducer as browse, BrowseUIState } from './browse/reducer'
import {
  homepageReducer as homepage,
  HomepageUIState
} from './homepage/reducer'
import { partnerReducer as partner, PartnerUIState } from './partner/reducer'

export type NFTUIState = {
  bid: BidUIState
  browse: BrowseUIState
  homepage: HomepageUIState
  partner: PartnerUIState
}

export const nftReducer = combineReducers({
  bid,
  browse,
  homepage,
  partner
})
