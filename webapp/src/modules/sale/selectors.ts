import { createSelector } from 'reselect'
import { RootState } from '../reducer'
import { Sale } from '@dcl/schemas'

export const getState = (state: RootState) => state.sale
export const getData = (state: RootState) => getState(state).data
export const getCount = (state: RootState) => getState(state).count
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const getSales = createSelector<
  RootState,
  ReturnType<typeof getData>,
  Sale[]
>(getData, data => {
  return Object.values(data)
})
