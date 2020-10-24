import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { toBidObject } from './utils'
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
