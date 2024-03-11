import {
  FETCH_BIDS_BY_NFT_SUCCESS,
  FETCH_BIDS_BY_ADDRESS_SUCCESS,
  ARCHIVE_BID,
  UNARCHIVE_BID,
  FetchBidsByAddressSuccessAction,
  ArchiveBidAction,
  UnarchiveBidAction,
  FetchBidsByNFTSuccessAction
} from '../../../bid/actions'

export type BidUIState = {
  seller: string[]
  bidder: string[]
  archived: string[]
  nft: string[]
}

const INITIAL_STATE: BidUIState = {
  seller: [],
  bidder: [],
  archived: [],
  nft: []
}

type UIReducerAction = FetchBidsByAddressSuccessAction | FetchBidsByNFTSuccessAction | ArchiveBidAction | UnarchiveBidAction

export function bidReducer(state: BidUIState = INITIAL_STATE, action: UIReducerAction) {
  switch (action.type) {
    case FETCH_BIDS_BY_ADDRESS_SUCCESS: {
      const { sellerBids, bidderBids } = action.payload
      return {
        ...state,
        seller: sellerBids.map(bid => bid.id),
        bidder: bidderBids.map(bid => bid.id)
      }
    }
    case FETCH_BIDS_BY_NFT_SUCCESS: {
      const { bids } = action.payload
      return {
        ...state,
        nft: bids.map(bid => bid.id)
      }
    }
    case ARCHIVE_BID: {
      const { bid } = action.payload
      return {
        ...state,
        archived: [...state.archived.filter(id => id !== bid.id), bid.id]
      }
    }
    case UNARCHIVE_BID: {
      const { bid } = action.payload
      return {
        ...state,
        archived: [...state.archived.filter(id => id !== bid.id)]
      }
    }
    default:
      return state
  }
}
