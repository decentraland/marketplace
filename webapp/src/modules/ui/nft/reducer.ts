import { combineReducers } from 'redux'
import { bidReducer as bid, BidUIState } from './bid/reducer'
import {
  homepageReducer as homepage,
  HomepageUIState
} from './homepage/reducer'
import { partnerReducer as partner, PartnerUIState } from './partner/reducer'

export type NFTUIState = {
  bid: BidUIState
  homepage: HomepageUIState
  partner: PartnerUIState
}

export const nftReducer = combineReducers({
  bid,
  homepage,
  partner
})
