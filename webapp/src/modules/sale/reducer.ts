import { Sale } from '@dcl/schemas'
import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchSalesFailureAction,
  FetchSalesRequestAction,
  FetchSalesSuccessAction,
  FETCH_SALES_FAILURE,
  FETCH_SALES_REQUEST,
  FETCH_SALES_SUCCESS
} from './actions'

export type SaleState = {
  data: Record<string, Sale>
  count: number
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: SaleState = {
  data: {},
  count: 0,
  loading: [],
  error: null
}

type SaleReducerAction = FetchSalesRequestAction | FetchSalesSuccessAction | FetchSalesFailureAction

export function saleReducer(state = INITIAL_STATE, action: SaleReducerAction): SaleState {
  switch (action.type) {
    case FETCH_SALES_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_SALES_SUCCESS: {
      const { sales, count } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: sales.reduce(
          (acc, sale) => {
            acc[sale.id] = sale
            return acc
          },
          {} as Record<string, Sale>
        ),
        count
      }
    }
    case FETCH_SALES_FAILURE: {
      const { error } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    }
    default:
      return state
  }
}
