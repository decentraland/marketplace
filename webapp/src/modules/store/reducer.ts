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
  RevertLocalStoreAction,
  REVERT_LOCAL_STORE,
  UpdateLocalStoreAction,
  UpdateStoreFailureAction,
  UpdateStoreRequestAction,
  UpdateStoreSuccessAction,
  UPDATE_LOCAL_STORE,
  UPDATE_STORE_FAILURE,
  UPDATE_STORE_REQUEST,
  UPDATE_STORE_SUCCESS
} from './actions'
import { Store } from './types'

export type StoreState = {
  data: Record<string, Store>
  localStore: Store | null
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: StoreState = {
  data: {},
  localStore: null,
  loading: [],
  error: null
}

type StoreReducerAction =
  | UpdateLocalStoreAction
  | RevertLocalStoreAction
  | UpdateStoreRequestAction
  | UpdateStoreSuccessAction
  | UpdateStoreFailureAction
  | FetchStoreRequestAction
  | FetchStoreSuccessAction
  | FetchStoreFailureAction

export function storeReducer(
  state = INITIAL_STATE,
  action: StoreReducerAction
): StoreState {
  switch (action.type) {
    case FETCH_STORE_REQUEST:
    case UPDATE_STORE_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_STORE_SUCCESS: {
      const { store } = action.payload
      return {
        ...state,
        data: !store
          ? state.data
          : {
              ...state.data,
              [store.owner]: store
            },
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case UPDATE_STORE_SUCCESS: {
      const { store } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          [store.owner]: store
        },
        localStore: null,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case FETCH_STORE_FAILURE:
    case UPDATE_STORE_FAILURE: {
      const { error } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    }
    case UPDATE_LOCAL_STORE:
      const { store } = action.payload
      return {
        ...state,
        localStore: store
      }
    case REVERT_LOCAL_STORE: {
      const { address } = action.payload
      const previous = state.data[address]

      return {
        ...state,
        localStore: previous ? { ...previous } : null
      }
    }
    default:
      return state
  }
}
