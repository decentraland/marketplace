import { RootState } from '../reducer'

export const getState = (state: RootState) => state.authorization
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const isLoading = (state: RootState) => getLoading(state).length > 0
export const getError = (state: RootState) => getState(state).error
