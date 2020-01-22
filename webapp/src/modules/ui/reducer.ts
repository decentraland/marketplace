import {
  FetchOrdersSuccessAction,
  FETCH_ORDERS_SUCCESS
} from '../order/actions'
import {
  FetchAccountSuccessAction,
  FETCH_ACCOUNT_SUCCESS
} from '../account/actions'

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
        case 'account': {
          return {
            ...state,
            accountNFTIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case 'load-more': {
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
        case 'market': {
          return {
            ...state,
            marketOrderIds: action.payload.orders.map(order => order.id)
          }
        }
        case 'load-more': {
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
