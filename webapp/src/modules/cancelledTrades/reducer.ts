import { LoadingState, loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { isTransactionAction } from 'decentraland-dapps/dist/modules/transaction/utils'
import { isNFT } from '../asset/utils'
import { PLACE_BID_SUCCESS, PlaceBidSuccessAction } from '../bid/actions'
import { CREATE_ORDER_SUCCESS, CreateOrderSuccessAction } from '../order/actions'
import { CancelledTrade, CancelledTradeType } from '../vendor/decentraland/cancelledTrades/types'
import {
  FETCH_CANCELLED_TRADES_FAILURE,
  FETCH_CANCELLED_TRADES_REQUEST,
  FETCH_CANCELLED_TRADES_SUCCESS,
  FetchCancelledTradesFailureAction,
  FetchCancelledTradesRequestAction,
  FetchCancelledTradesSuccessAction
} from './actions'

export type CancelledTradesState = {
  data: CancelledTrade[]
  total: number
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: CancelledTradesState = {
  data: [],
  total: 0,
  loading: [],
  error: null
}

type CancelledTradesReducerAction =
  | FetchCancelledTradesRequestAction
  | FetchCancelledTradesSuccessAction
  | FetchCancelledTradesFailureAction
  | CreateOrderSuccessAction
  | PlaceBidSuccessAction

type RecreatedOrder = { type: CancelledTradeType; contractAddress: string; tokenId?: string; itemId?: string }

const isRecreatedBy = (trade: CancelledTrade, order: RecreatedOrder) =>
  trade.type === order.type &&
  trade.asset.contractAddress.toLowerCase() === order.contractAddress.toLowerCase() &&
  (order.tokenId !== undefined ? trade.asset.tokenId === order.tokenId : trade.asset.itemId === order.itemId)

// The server stops returning a re-created order, so it's dropped locally to keep the list and the skip offset in sync.
const removeRecreated = (state: CancelledTradesState, order: RecreatedOrder): CancelledTradesState => {
  const data = state.data.filter(trade => !isRecreatedBy(trade, order))
  const removed = state.data.length - data.length
  return removed ? { ...state, data, total: Math.max(state.total - removed, 0) } : state
}

export function cancelledTradesReducer(state = INITIAL_STATE, action: CancelledTradesReducerAction): CancelledTradesState {
  switch (action.type) {
    case FETCH_CANCELLED_TRADES_REQUEST:
      return { ...state, loading: loadingReducer(state.loading, action), error: null }
    case FETCH_CANCELLED_TRADES_SUCCESS: {
      const { trades, total, skip } = action.payload
      // Offset paging: rows that leave the server between pages (e.g. expired) shift the offset and
      // can skip later rows until the next page load. Only reachable past the first page.
      const loadedIds = new Set(state.data.map(trade => trade.id))
      const data = skip === 0 ? trades : [...state.data, ...trades.filter(trade => !loadedIds.has(trade.id))]
      return { ...state, data, total, loading: loadingReducer(state.loading, action), error: null }
    }
    case FETCH_CANCELLED_TRADES_FAILURE:
      return { ...state, loading: loadingReducer(state.loading, action), error: action.payload.error }
    case CREATE_ORDER_SUCCESS: {
      // Only an off-chain trade re-creates the cancelled one; on-chain orders carry a tx hash.
      if (isTransactionAction(action)) return state
      const { nft } = action.payload
      return removeRecreated(state, {
        type: CancelledTradeType.PUBLIC_NFT_ORDER,
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId
      })
    }
    case PLACE_BID_SUCCESS: {
      const { asset } = action.payload
      return removeRecreated(state, {
        type: CancelledTradeType.BID,
        contractAddress: asset.contractAddress,
        ...(isNFT(asset) ? { tokenId: asset.tokenId } : { itemId: asset.itemId })
      })
    }
    default:
      return state
  }
}
