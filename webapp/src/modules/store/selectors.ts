import { createSelector } from 'reselect'
import { Store } from './types'
import { RootState } from '../reducer'

export const getState = (state: RootState) => state.store
export const getData = (state: RootState) => getState(state).data
export const getStoresByOwner = getData
export const getLoading = (state: RootState) => getState(state).loading
export const getLocalStore = (state: RootState) => getState(state).localStore
export const getError = (state: RootState) => getState(state).error

export const getIsLocalStoreDirty = createSelector<
  RootState,
  Record<string, Store>,
  Store | null,
  boolean
>(getData, getLocalStore, (storeData, localStore) => {
  return (
    !!localStore &&
    !Object.values(storeData).some(store => store === localStore)
  )
})
