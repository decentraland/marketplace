import { RootState } from '../reducer'

export const getState = (state: RootState) => state.favorites
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const getFavoritesDataByItemId = (state: RootState, itemId: string) =>
  getData(state)[itemId]
