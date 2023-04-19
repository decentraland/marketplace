import { CatalogItem } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FETCH_CATALOG_FAILURE,
  FETCH_CATALOG_REQUEST,
  FETCH_CATALOG_SUCCESS,
  FetchCatalogFailureAction,
  FetchCatalogRequestAction,
  FetchCatalogSuccessAction
} from './actions'

export type CatalogState = {
  data: Record<string, CatalogItem>
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: CatalogState = {
  data: {},
  loading: [],
  error: null
}

type CatalogReducerAction =
  | FetchCatalogFailureAction
  | FetchCatalogRequestAction
  | FetchCatalogSuccessAction

export function catalogItemReducer(
  state = INITIAL_STATE,
  action: CatalogReducerAction
): CatalogState {
  switch (action.type) {
    case FETCH_CATALOG_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_CATALOG_SUCCESS: {
      const { catalogItems } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          ...catalogItems.reduce((obj, catalogItem) => {
            obj[catalogItem.id] = catalogItem
            return obj
          }, {} as Record<string, CatalogItem>)
        },
        error: null
      }
    }
    case FETCH_CATALOG_FAILURE: {
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
