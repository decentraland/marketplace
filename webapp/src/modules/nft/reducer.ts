import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  UpsertRentalSuccessAction,
  UPSERT_RENTAL_SUCCESS
} from '../rental/actions'

import { NFT } from './types'
import {
  FetchNFTRequestAction,
  FetchNFTSuccessAction,
  FetchNFTFailureAction,
  FETCH_NFT_REQUEST,
  FETCH_NFT_SUCCESS,
  FETCH_NFT_FAILURE,
  FetchNFTsRequestAction,
  FetchNFTsSuccessAction,
  FetchNFTsFailureAction,
  FETCH_NFTS_REQUEST,
  FETCH_NFTS_SUCCESS,
  FETCH_NFTS_FAILURE,
  TRANSFER_NFT_REQUEST,
  TRANSFER_NFT_FAILURE,
  TRANSFER_NFT_SUCCESS,
  TransferNFTRequestAction,
  TransferNFTSuccessAction,
  TransferNFTFailureAction
} from './actions'

export type NFTState = {
  data: Record<string, NFT>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

type NFTReducerAction =
  | FetchNFTRequestAction
  | FetchNFTSuccessAction
  | FetchNFTFailureAction
  | FetchNFTsRequestAction
  | FetchNFTsSuccessAction
  | FetchNFTsFailureAction
  | TransferNFTRequestAction
  | TransferNFTSuccessAction
  | TransferNFTFailureAction
  | UpsertRentalSuccessAction

export function nftReducer(
  state: NFTState = INITIAL_STATE,
  action: NFTReducerAction
) {
  switch (action.type) {
    case TRANSFER_NFT_REQUEST:
    case FETCH_NFTS_REQUEST:
    case FETCH_NFT_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case TRANSFER_NFT_FAILURE:
    case FETCH_NFTS_FAILURE:
    case FETCH_NFT_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    case FETCH_NFT_SUCCESS: {
      const { nft } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [nft.id]: nft
        },
        error: null
      }
    }
    case FETCH_NFTS_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          ...action.payload.nfts.reduce((obj, nft) => {
            obj[nft.id] = nft
            return obj
          }, {} as Record<string, NFT>)
        }
      }
    }
    case TRANSFER_NFT_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case UPSERT_RENTAL_SUCCESS: {
      const { rental, nft } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          [nft.id]: {
            ...state.data[nft.id],
            openRentalId: rental.id
          }
        },
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    default:
      return state
  }
}
