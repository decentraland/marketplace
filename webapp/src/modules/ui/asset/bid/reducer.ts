import {
  FETCH_BIDS_BY_ASSET_SUCCESS,
  FETCH_BIDS_BY_ASSET_REQUEST,
  FETCH_BIDS_BY_ADDRESS_SUCCESS,
  ARCHIVE_BID,
  UNARCHIVE_BID,
  FetchBidsByAddressSuccessAction,
  ArchiveBidAction,
  UnarchiveBidAction,
  FetchBidsByAssetSuccessAction,
  FetchBidsByAssetRequestAction
} from '../../../bid/actions'

export type BidUIState = {
  seller: string[]
  bidder: string[]
  archived: string[]
  asset: string[]
}

const INITIAL_STATE: BidUIState = {
  seller: [],
  bidder: [],
  archived: [],
  asset: []
}

type UIReducerAction =
  | FetchBidsByAddressSuccessAction
  | FetchBidsByAssetSuccessAction
  | ArchiveBidAction
  | UnarchiveBidAction
  | FetchBidsByAssetRequestAction

export function bidReducer(state: BidUIState = INITIAL_STATE, action: UIReducerAction) {
  switch (action.type) {
    case FETCH_BIDS_BY_ASSET_REQUEST: {
      return {
        ...state,
        asset: []
      }
    }
    case FETCH_BIDS_BY_ADDRESS_SUCCESS: {
      const { sellerBids, bidderBids } = action.payload
      return {
        ...state,
        seller: sellerBids.map(bid => bid.id),
        bidder: bidderBids.map(bid => bid.id)
      }
    }
    case FETCH_BIDS_BY_ASSET_SUCCESS: {
      const { bids } = action.payload
      return {
        ...state,
        asset: bids.map(bid => bid.id)
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
