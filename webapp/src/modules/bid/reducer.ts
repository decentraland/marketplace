import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { Bid } from './types'
import {
  FetchBidsByAddressRequestAction,
  FetchBidsByAddressSuccessAction,
  FetchBidsByAddressFailureAction,
  FETCH_BIDS_BY_ADDRESS_REQUEST,
  FETCH_BIDS_BY_ADDRESS_SUCCESS,
  FETCH_BIDS_BY_ADDRESS_FAILURE,
  FetchBidsByNFTRequestAction,
  FetchBidsByNFTSuccessAction,
  FetchBidsByNFTFailureAction,
  FETCH_BIDS_BY_NFT_REQUEST,
  FETCH_BIDS_BY_NFT_SUCCESS,
  FETCH_BIDS_BY_NFT_FAILURE
} from './actions'

export type BidState = {
  data: Record<string, Bid>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: BidState = {
  data: {},
  loading: [],
  error: null
}

type BidReducerAction =
  | FetchBidsByAddressRequestAction
  | FetchBidsByAddressSuccessAction
  | FetchBidsByAddressFailureAction
  | FetchBidsByNFTRequestAction
  | FetchBidsByNFTSuccessAction
  | FetchBidsByNFTFailureAction

export function bidReducer(state = INITIAL_STATE, action: BidReducerAction) {
  switch (action.type) {
    case FETCH_BIDS_BY_NFT_REQUEST:
    case FETCH_BIDS_BY_ADDRESS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }

    case FETCH_BIDS_BY_NFT_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...action.payload.bids.reduce((obj, bid) => {
            obj[bid.id] = bid
            return obj
          }, {} as Record<string, Bid>)
        }
      }
    }

    case FETCH_BIDS_BY_ADDRESS_SUCCESS: {
      const { seller, bidder } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...seller.reduce((obj, bid) => {
            obj[bid.id] = bid
            return obj
          }, {} as Record<string, Bid>),
          ...bidder.reduce((obj, bid) => {
            obj[bid.id] = bid
            return obj
          }, {} as Record<string, Bid>)
        }
      }
    }

    case FETCH_BIDS_BY_NFT_FAILURE:
    case FETCH_BIDS_BY_ADDRESS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }

    default:
      return state
  }
}
