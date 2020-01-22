import {
  LoadingState,
  loadingReducer
} from 'decentraland-dapps/dist/modules/loading/reducer'

import {
  FetchOrdersSuccessAction,
  FETCH_ORDERS_SUCCESS
} from '../order/actions'
import {
  FetchAccountSuccessAction,
  FETCH_ACCOUNT_SUCCESS
} from '../account/actions'
import { NFT } from './types'
import {
  FetchNFTRequestAction,
  FetchNFTSuccessAction,
  FetchNFTFailureAction,
  FETCH_NFT_REQUEST,
  FETCH_NFT_SUCCESS,
  FETCH_NFT_FAILURE
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
  | FetchAccountSuccessAction
  | FetchNFTRequestAction
  | FetchNFTSuccessAction
  | FetchNFTFailureAction
  | FetchOrdersSuccessAction

export function nftReducer(
  state: NFTState = INITIAL_STATE,
  action: NFTReducerAction
) {
  switch (action.type) {
    case FETCH_NFT_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
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
    case FETCH_NFT_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    case FETCH_ACCOUNT_SUCCESS:
    case FETCH_ORDERS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.nfts.reduce((obj, nft) => {
            obj[nft.id] = nft
            return obj
          }, {} as Record<string, NFT>)
        }
      }
    }
    default:
      return state
  }
}
