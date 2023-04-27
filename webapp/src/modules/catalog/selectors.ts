import { CatalogItem } from '@dcl/schemas'
import { createSelector } from 'reselect'
import { RootState } from '../reducer'

export const getState = (state: RootState) => state.catalogItem
export const getData = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const getCatalogItems = createSelector<
  RootState,
  ReturnType<typeof getData>,
  CatalogItem[]
>(getData, itemsById => Object.values(itemsById))
