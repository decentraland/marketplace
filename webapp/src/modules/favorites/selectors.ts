import { createMatchSelector } from 'connected-react-router'
import { createSelector } from 'reselect'
import { Item } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../reducer'
import { locations } from '../routing/locations'
import { getData as getItems } from '../item/selectors'
import { FavoritesData } from './types'
import {
  FETCH_FAVORITED_ITEMS_REQUEST,
  PICK_ITEM_AS_FAVORITE_REQUEST,
  UNPICK_ITEM_AS_FAVORITE_REQUEST,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST,
  FETCH_LISTS_REQUEST,
  CREATE_LIST_REQUEST,
  DELETE_LIST_REQUEST
} from './actions'

export const getState = (state: RootState) => state.favorites
export const getData = (state: RootState) => getState(state).data
export const getFavoritedItems = (state: RootState) => getData(state).items
export const getLists = (state: RootState) => getData(state).lists
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const isLoadingFavoritedItems = (state: RootState): boolean =>
  isLoadingType(getLoading(state), FETCH_FAVORITED_ITEMS_REQUEST)

export const isLoadingLists = (state: RootState): boolean =>
  isLoadingType(getLoading(state), FETCH_LISTS_REQUEST)
export const isLoadingCreateList = (state: RootState): boolean =>
  isLoadingType(getLoading(state), CREATE_LIST_REQUEST)
export const isLoadingDeleteList = (state: RootState): boolean =>
  isLoadingType(getLoading(state), DELETE_LIST_REQUEST)

export const getFavoritesDataByItemId = (
  state: RootState,
  itemId: string
): FavoritesData | undefined => getFavoritedItems(state)[itemId]

export const getIsPickedByUser = (state: RootState, itemId: string) =>
  getFavoritesDataByItemId(state, itemId)?.pickedByUser || false
export const getCount = (state: RootState, itemId: string) =>
  getFavoritesDataByItemId(state, itemId)?.count || 0

const listMatchSelector = createMatchSelector<
  RootState,
  {
    listId: string
  }
>(locations.list())

export const getListId = createSelector<
  RootState,
  ReturnType<typeof listMatchSelector>,
  string | null
>(listMatchSelector, match => match?.params.listId || null)

export const isPickingOrUnpicking = (state: RootState, itemId: string) =>
  getLoading(state).some(
    ({ type, payload }) =>
      [
        PICK_ITEM_AS_FAVORITE_REQUEST,
        UNPICK_ITEM_AS_FAVORITE_REQUEST,
        UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST
      ].includes(type) && payload.item.id === itemId
  )

export const getList = (state: RootState, id: string) => getLists(state)[id]
export const getPreviewListItems = (state: RootState, id: string): Item[] =>
  getLists(state)
    [id]?.previewOfItemIds?.map(itemId => getItems(state)[itemId])
    .filter(Boolean) ?? []
