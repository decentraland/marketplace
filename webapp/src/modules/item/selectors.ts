import { createSelector } from 'reselect'
import { createMatchSelector } from 'connected-react-router'
import { Item } from '@dcl/schemas'
import { locations } from '../routing/locations'
import { RootState } from '../reducer'
import { FETCH_ITEMS_REQUEST, FETCH_ITEM_REQUEST } from './actions'

export const getState = (state: RootState) => state.item
export const getData = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const isFetchingItem = (
  state: RootState,
  contractAddress: string,
  tokenId: string
) =>
  getLoading(state).find(
    action =>
      action.type === FETCH_ITEM_REQUEST &&
      action.payload.contractAddress === contractAddress &&
      action.payload.tokenId === tokenId
  ) !== undefined

export const isFetchingItemsOfCollection = (
  state: RootState,
  contractAddress: string
) =>
  getLoading(state).find(
    action =>
      action.type === FETCH_ITEMS_REQUEST &&
      action.payload.filters?.contracts?.includes(contractAddress)
  ) !== undefined

export const getItems = createSelector<
  RootState,
  ReturnType<typeof getData>,
  Item[]
>(getData, itemsById => Object.values(itemsById))

const ItemDetailMatchSelector = createMatchSelector<
  RootState,
  {
    contractAddress: string
    tokenId: string
  }
>(locations.item(':contractAddress', ':tokenId'))

export const getContractAddress = createSelector<
  RootState,
  ReturnType<typeof ItemDetailMatchSelector>,
  string | null
>(
  ItemDetailMatchSelector,
  match => match?.params.contractAddress.toLowerCase() || null
)

export const getTokenId = createSelector<
  RootState,
  ReturnType<typeof ItemDetailMatchSelector>,
  string | null
>(ItemDetailMatchSelector, match => match?.params.tokenId || null)

export const getItemsByContractAddress = createSelector(getItems, items =>
  items.reduce((acc, item) => {
    const { contractAddress } = item
    if (!acc[contractAddress]) acc[contractAddress] = []
    acc[contractAddress].push(item)
    return acc
  }, {} as Record<string, Item[]>)
)
