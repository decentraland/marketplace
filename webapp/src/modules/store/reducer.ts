import {
  RevertLocalStoreAction,
  REVERT_LOCAL_STORE,
  UpdateLocalStoreAction,
  UPDATE_LOCAL_STORE
} from './actions'
import { Store } from './types'
import { getEmptyLocalStore } from './utils'

export type StoreState = {
  localStore: Store | null
}

export const INITIAL_STATE: StoreState = {
  localStore: null
}

type StoreReducerAction = UpdateLocalStoreAction | RevertLocalStoreAction

export function storeReducer(
  state = INITIAL_STATE,
  action: StoreReducerAction
): StoreState {
  switch (action.type) {
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
