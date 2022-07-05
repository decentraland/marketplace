import { combineReducers } from 'redux'
import { bidReducer as bid, BidUIState } from './bid/reducer'

export type NFTUIState = {
  bid: BidUIState
}

export const nftReducer = combineReducers({
  bid
})
