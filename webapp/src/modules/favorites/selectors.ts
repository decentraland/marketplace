import { createMatchSelector } from 'connected-react-router'
import { AnyAction } from 'redux'
import { createSelector } from 'reselect'
import { Item } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { getData as getItems } from '../item/selectors'
import { RootState } from '../reducer'
import { locations } from '../routing/locations'
import { DEFAULT_FAVORITES_LIST_ID, ListOfLists } from '../vendor/decentraland/favorites'
import {
  FETCH_FAVORITED_ITEMS_REQUEST,
  FETCH_LISTS_REQUEST,
  CREATE_LIST_REQUEST,
  DELETE_LIST_REQUEST,
  BULK_PICK_REQUEST,
  UPDATE_LIST_REQUEST,
  BulkPickUnpickRequestAction
} from './actions'
import { FavoritesData, List } from './types'

const isBulkPickRequestAction = (action: AnyAction): action is BulkPickUnpickRequestAction => action.type === BULK_PICK_REQUEST

export const getState = (state: RootState) => state.favorites
export const getData = (state: RootState) => getState(state).data
export const getFavoritedItems = (state: RootState) => getData(state).items
export const getLists = (state: RootState) => getData(state).lists
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const isLoadingFavoritedItems = (state: RootState): boolean => isLoadingType(getLoading(state), FETCH_FAVORITED_ITEMS_REQUEST)

export const isLoadingLists = (state: RootState): boolean => isLoadingType(getLoading(state), FETCH_LISTS_REQUEST)
export const isLoadingCreateList = (state: RootState): boolean => isLoadingType(getLoading(state), CREATE_LIST_REQUEST)
export const isLoadingUpdateList = (state: RootState): boolean => isLoadingType(getLoading(state), UPDATE_LIST_REQUEST)
export const isLoadingDeleteList = (state: RootState): boolean => isLoadingType(getLoading(state), DELETE_LIST_REQUEST)
export const isLoadingBulkPicksUnpicks = (state: RootState): boolean => isLoadingType(getLoading(state), BULK_PICK_REQUEST)

export const getFavoritesDataByItemId = (state: RootState, itemId: string): FavoritesData | undefined => getFavoritedItems(state)[itemId]

export const getIsPickedByUser = (state: RootState, itemId: string) => getFavoritesDataByItemId(state, itemId)?.pickedByUser || false
export const getCount = (state: RootState, itemId: string) => getFavoritesDataByItemId(state, itemId)?.count || 0

const listMatchSelector = createMatchSelector<
  RootState,
  {
    listId: string
  }
>(locations.list())

export const getListId = createSelector<RootState, ReturnType<typeof listMatchSelector>, string | null>(
  listMatchSelector,
  match => match?.params.listId || null
)

export const isPickingOrUnpicking = (state: RootState, itemId: string) =>
  getLoading(state).some(action => isBulkPickRequestAction(action) && action.payload.item.id === itemId)

export const getList = (state: RootState, id: string): List | null => getLists(state)[id] ?? null

export const getPreviewListItems = (state: RootState, id: string): Item[] =>
  getLists(state)
    [id]?.previewOfItemIds?.map(itemId => getItems(state)[itemId])
    .filter(Boolean) ?? []

export const isOwnerUnpickingFromCurrentList = (state: RootState, unpickedFrom: ListOfLists[]): boolean => {
  const currentListId = getListId(state)
  const isCurrentListUnpicked = unpickedFrom.some(list => list.id === currentListId)
  if (!isCurrentListUnpicked || !currentListId) {
    return false
  }
  const userAddress = getAddress(state)
  const currentUnpickedList = getList(state, currentListId)
  const isListOwner =
    currentUnpickedList?.userAddress?.toLowerCase() === userAddress?.toLowerCase() || currentListId === DEFAULT_FAVORITES_LIST_ID
  return isListOwner && currentUnpickedList !== undefined
}
