import { createSelector } from 'reselect'
import { RootState } from '../reducer'
import { FETCH_CATALOG_REQUEST } from './actions'
import { CatalogItem } from './types'

export const getState = (state: RootState) => state.catalogItem
export const getData = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const isFetchingCatalogItems = (
  state: RootState,
  contractAddress: string,
  tokenId: string
) =>
  getLoading(state).find(
    action =>
      action.type === FETCH_CATALOG_REQUEST &&
      action.payload.contractAddress === contractAddress &&
      action.payload.tokenId === tokenId
  ) !== undefined

export const getCatalogItems = createSelector<
  RootState,
  ReturnType<typeof getData>,
  CatalogItem[]
>(getData, itemsById => Object.values(itemsById))
