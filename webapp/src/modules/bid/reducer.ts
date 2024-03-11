import { Bid } from '@dcl/schemas'
import { LoadingState, loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { toBidObject } from './utils'
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
  FETCH_BIDS_BY_NFT_FAILURE,
  ACCEPT_BID_REQUEST,
  CANCEL_BID_REQUEST,
  PLACE_BID_REQUEST,
  PLACE_BID_SUCCESS,
  ACCEPT_BID_SUCCESS,
  CANCEL_BID_SUCCESS,
  PLACE_BID_FAILURE,
  ACCEPT_BID_FAILURE,
  CANCEL_BID_FAILURE,
  PlaceBidRequestAction,
  PlaceBidFailureAction,
  PlaceBidSuccessAction,
  AcceptBidRequestAction,
  AcceptBidFailureAction,
  AcceptBidSuccessAction,
  CancelBidRequestAction,
  CancelBidFailureAction,
  CancelBidSuccessAction,
  ClearBidErrorAction,
  CLEAR_BID_ERROR
} from './actions'

export type BidState = {
  data: Record<string, Bid>
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: BidState = {
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
  | PlaceBidRequestAction
  | PlaceBidFailureAction
  | PlaceBidSuccessAction
  | AcceptBidRequestAction
  | AcceptBidFailureAction
  | AcceptBidSuccessAction
  | CancelBidRequestAction
  | CancelBidFailureAction
  | CancelBidSuccessAction
  | ClearBidErrorAction

export function bidReducer(state = INITIAL_STATE, action: BidReducerAction) {
  switch (action.type) {
    case PLACE_BID_REQUEST:
    case ACCEPT_BID_REQUEST:
    case CANCEL_BID_REQUEST:
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
          ...toBidObject(action.payload.bids)
        }
      }
    }

    case FETCH_BIDS_BY_ADDRESS_SUCCESS: {
      const { sellerBids, bidderBids } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...toBidObject(sellerBids),
          ...toBidObject(bidderBids)
        }
      }
    }

    case PLACE_BID_SUCCESS:
    case ACCEPT_BID_SUCCESS:
    case CANCEL_BID_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }

    case PLACE_BID_FAILURE:
    case ACCEPT_BID_FAILURE:
    case CANCEL_BID_FAILURE:
    case FETCH_BIDS_BY_NFT_FAILURE:
    case FETCH_BIDS_BY_ADDRESS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }

    case CLEAR_BID_ERROR:
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}
