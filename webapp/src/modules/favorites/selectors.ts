import { RootState } from '../reducer'
import { FavoritesData } from './types'

export const getState = (state: RootState) => state.favorites
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const getFavoritesDataByItemId = (
  state: RootState,
  itemId: string
): FavoritesData | undefined => getData(state)[itemId]

export const getIsPickedByUser = (state: RootState, itemId: string) =>
  getFavoritesDataByItemId(state, itemId)?.pickedByUser || false
export const getCount = (state: RootState, itemId: string) =>
  getFavoritesDataByItemId(state, itemId)?.count || 0
