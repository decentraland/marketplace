import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
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
import { getEmptyLocalStore } from './utils'

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

export function storeReducer(
  state = INITIAL_STATE,
  action: StoreReducerAction
): StoreState {
  switch (action.type) {
    case UPDATE_STORE_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case UPDATE_STORE_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case UPDATE_STORE_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case UPDATE_LOCAL_STORE:
      const { store } = action.payload
      return {
        ...state,
        localStore: store
      }
    case REVERT_LOCAL_STORE:
      return {
        ...state,
        localStore: getEmptyLocalStore()
      }
    default:
      return state
  }
}
