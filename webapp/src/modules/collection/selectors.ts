import { Collection } from '@dcl/schemas'
import { createMatchSelector } from 'connected-react-router'
import { createSelector } from 'reselect'
import { locations } from '../routing/locations'
import { RootState } from '../reducer'
import {
  FETCH_COLLECTIONS_REQUEST,
  FETCH_SINGLE_COLLECTION_REQUEST
} from './actions'

export const getState = (state: RootState) => state.collection
export const getCollectionsByUrn = (state: RootState) => getState(state).data
export const getCount = (state: RootState) => getState(state).count
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const isFetchingCollection = (
  state: RootState,
  contractAddress: string
) =>
  getLoading(state).find(
    action =>
      (action.type === FETCH_SINGLE_COLLECTION_REQUEST &&
        action.payload.contractAddress === contractAddress) ||
      (action.type === FETCH_COLLECTIONS_REQUEST &&
        action.payload.filters?.contractAddress === contractAddress)
  ) !== undefined

export const getCollections = createSelector<
  RootState,
  ReturnType<typeof getCollectionsByUrn>,
  Collection[]
>(getCollectionsByUrn, collectionsByUrn => Object.values(collectionsByUrn))

export const getCollectionsByAddress = createSelector<
  RootState,
  ReturnType<typeof getCollections>,
  Record<string, Collection>
>(getCollections, collections =>
  Object.values(collections).reduce((acc, collection) => {
    acc[collection.contractAddress] = collection
    return acc
  }, {} as Record<string, Collection>)
)

const CollectionDetailMatchSelector = createMatchSelector<
  RootState,
  { contractAddress: string }
>(locations.collection(':contractAddress'))

export const getContractAddress = createSelector<
  RootState,
  ReturnType<typeof CollectionDetailMatchSelector>,
  string | null
>(
  CollectionDetailMatchSelector,
  match => match?.params.contractAddress.toLowerCase() || null
)
