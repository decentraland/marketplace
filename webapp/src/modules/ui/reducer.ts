import {
  FetchOrdersSuccessAction,
  FETCH_ORDERS_SUCCESS
} from '../order/actions'
import {
  FetchAccountSuccessAction,
  FETCH_ACCOUNT_SUCCESS
} from '../account/actions'
import { View } from './types'

export type UIState = {
  marketOrderIds: string[]
  accountNFTIds: string[]
}

const INITIAL_STATE: UIState = {
  marketOrderIds: [],
  accountNFTIds: []
}

type UIReducerAction = FetchAccountSuccessAction | FetchOrdersSuccessAction

export function uiReducer(
  state: UIState = INITIAL_STATE,
  action: UIReducerAction
) {
  switch (action.type) {
    case FETCH_ACCOUNT_SUCCESS: {
      switch (action.payload.options.view) {
        case View.ACCOUNT: {
          return {
            ...state,
            accountNFTIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case View.LOAD_MORE: {
          return {
            ...state,
            accountNFTIds: [
              ...state.accountNFTIds,
              ...action.payload.nfts.map(nft => nft.id)
            ]
          }
        }
        default:
          return state
      }
    }
    case FETCH_ORDERS_SUCCESS: {
      switch (action.payload.options.view) {
        case View.MARKET: {
          return {
            ...state,
            marketOrderIds: action.payload.orders.map(order => order.id)
          }
        }
        case View.LOAD_MORE: {
          return {
            ...state,
            marketOrderIds: [
              ...state.marketOrderIds,
              ...action.payload.orders.map(order => order.id)
            ]
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}
