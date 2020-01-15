import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'

import {
  FetchOrdersSuccessAction,
  FETCH_ORDERS_SUCCESS
} from '../order/actions'
import { NFT } from './types'

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

type NFTReducerAction = FetchOrdersSuccessAction

export function nftReducer(
  state: NFTState = INITIAL_STATE,
  action: NFTReducerAction
) {
  switch (action.type) {
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
