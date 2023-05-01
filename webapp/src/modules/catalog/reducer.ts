import { CatalogItem } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { CatalogData } from './types'
import {
  FETCH_CATALOG_FAILURE,
  FETCH_CATALOG_REQUEST,
  FETCH_CATALOG_SUCCESS,
  FetchCatalogFailureAction,
  FetchCatalogRequestAction,
  FetchCatalogSuccessAction
} from './actions'
import {
  FetchItemsRequestAction,
  FetchItemsSuccessAction,
  FetchItemSuccessAction,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS
} from '../item/actions'

export type CatalogState = {
  data: Record<string, CatalogData>
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
  | FetchItemsRequestAction
  | FetchItemsSuccessAction

export function catalogReducer(
  state = INITIAL_STATE,
  action: CatalogReducerAction
): CatalogState {
  switch (action.type) {
    case FETCH_ITEMS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    // case FETCH_CATALOG_REQUEST: {
    //   return {
    //     ...state,
    //     loading: loadingReducer(state.loading, action)
    //   }
    // }
    case FETCH_ITEMS_SUCCESS: {
      // case FETCH_CATALOG_SUCCESS: {
      const { items } = action.payload
      // const { catalogItems } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          ...items.reduce((obj, item) => {
            const {
              minPrice,
              minListingPrice,
              maxListingPrice,
              listings,
              owners
            } = item
            obj[item.id] = {
              minPrice,
              minListingPrice,
              maxListingPrice,
              listings,
              owners
            }
            return obj
          }, {} as Record<string, CatalogData>)
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
