import { combineReducers } from 'redux'
import { bidReducer as bid, BidUIState } from './bid/reducer'
import { partnerReducer as partner, PartnerUIState } from './partner/reducer'

export type NFTUIState = {
  bid: BidUIState
  partner: PartnerUIState
}

export const nftReducer = combineReducers({
  bid,
  partner
})
