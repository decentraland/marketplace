import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'

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
  FETCH_NFTS_FAILURE
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

/**
 * @TODO(eordano): Fixme -- issue inserted by a bad scan of the blockchain in the API
 */
function monkeyPatchFix(nft: NFT) {
  if (nft.wearable) {
    nft.image = nft.image.replace(',/', '/')
  }
  return nft
}

type NFTReducerAction =
  | FetchNFTRequestAction
  | FetchNFTSuccessAction
  | FetchNFTFailureAction
  | FetchNFTsRequestAction
  | FetchNFTsSuccessAction
  | FetchNFTsFailureAction

export function nftReducer(
  state: NFTState = INITIAL_STATE,
  action: NFTReducerAction
) {
  switch (action.type) {
    case FETCH_NFTS_REQUEST:
    case FETCH_NFT_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
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
          [nft.id]: monkeyPatchFix(nft)
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
            obj[nft.id] = monkeyPatchFix(nft)
            return obj
          }, {} as Record<string, NFT>)
        }
      }
    }
    default:
      return state
  }
}
