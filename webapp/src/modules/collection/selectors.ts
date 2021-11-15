import { Collection } from '@dcl/schemas'
import { createSelector } from 'reselect'
import { RootState } from '../reducer'

export const getState = (state: RootState) => state.collection
export const getCollectionsByUrn = (state: RootState) => getState(state).data
export const getCount = (state: RootState) => getState(state).count
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const getCollections = createSelector<
  RootState,
  ReturnType<typeof getCollectionsByUrn>,
  Collection[]
>(getCollectionsByUrn, collectionsByUrn => Object.values(collectionsByUrn))
