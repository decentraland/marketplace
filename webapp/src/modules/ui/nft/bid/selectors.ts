import { createSelector } from 'reselect'
import { Bid } from '@dcl/schemas'
import { BidState } from '../../../bid/reducer'
import { getData as getBidData } from '../../../bid/selectors'
import { RootState } from '../../../reducer'
import { BidUIState } from './reducer'

export const getState = (state: RootState) => state.ui.nft.bid

export const getSellerBids = createSelector<RootState, BidUIState, BidState['data'], Bid[]>(getState, getBidData, (bid, bidsById) =>
  bid.seller.map(id => bidsById[id])
)

export const getBidderBids = createSelector<RootState, BidUIState, BidState['data'], Bid[]>(getState, getBidData, (ui, bidsById) =>
  ui.bidder.map(id => bidsById[id])
)

export const getArchivedBidIds = (state: RootState) => getState(state).archived

export const getNFTBids = createSelector<RootState, BidUIState, BidState['data'], Bid[]>(getState, getBidData, (bid, bidsById) =>
  bid.nft.map(id => bidsById[id])
)
