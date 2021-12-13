import { Store } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchStoreFailureAction,
  FetchStoreRequestAction,
  FetchStoreSuccessAction,
  FETCH_STORE_FAILURE,
  FETCH_STORE_REQUEST,
  FETCH_STORE_SUCCESS,
  UpsertStoreFailureAction,
  UpsertStoreRequestAction,
  UpsertStoreSuccessAction,
  UPSERT_STORE_FAILURE,
  UPSERT_STORE_REQUEST,
  UPSERT_STORE_SUCCESS
} from './actions'

export type StoreState = {
  data: Record<string, Store>
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: StoreState = {
  data: {},
  loading: [],
  error: null
}

type StoreReducerAction =
  | FetchStoreRequestAction
  | FetchStoreSuccessAction
  | FetchStoreFailureAction
  | UpsertStoreRequestAction
  | UpsertStoreSuccessAction
  | UpsertStoreFailureAction

export function storeReducer(
  state = INITIAL_STATE,
  action: StoreReducerAction
): StoreState {
  switch (action.type) {
    case FETCH_STORE_REQUEST:
    case UPSERT_STORE_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }

    case FETCH_STORE_SUCCESS:
    case UPSERT_STORE_SUCCESS:
      const { store } = action.payload

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: { ...state.data, [store.owner]: store }
      }

    case FETCH_STORE_FAILURE:
    case UPSERT_STORE_FAILURE:
      const { error } = action.payload

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    default:
      return state
  }
}
