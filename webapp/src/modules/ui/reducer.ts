import {
  FetchOrdersSuccessAction,
  FETCH_ORDERS_SUCCESS
} from '../order/actions'

export type UIState = {
  marketOrderIds: string[]
}

const INITIAL_STATE: UIState = {
  marketOrderIds: []
}

type UIReducerAction = FetchOrdersSuccessAction

export function uiReducer(
  state: UIState = INITIAL_STATE,
  action: UIReducerAction
) {
  switch (action.type) {
    case FETCH_ORDERS_SUCCESS: {
      switch (action.payload.options.view) {
        case 'market': {
          return {
            ...state,
            marketOrderIds: action.payload.orders.map(order => order.id)
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
