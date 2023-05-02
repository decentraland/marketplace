import { action } from 'typesafe-actions'
import { Item } from '@dcl/schemas'
import { ItemBrowseOptions } from '../item/types'
import { List } from './types'

// Pick item as Favorite Request
export const PICK_ITEM_AS_FAVORITE_REQUEST =
  '[Request] Pick item as Favorite Request'
export const PICK_ITEM_AS_FAVORITE_SUCCESS =
  '[Success] Pick item as Favorite Request'
export const PICK_ITEM_AS_FAVORITE_FAILURE =
  '[Failure] Pick item as Favorite Request'

export const pickItemAsFavoriteRequest = (item: Item) =>
  action(PICK_ITEM_AS_FAVORITE_REQUEST, { item })

export const pickItemAsFavoriteSuccess = (item: Item) =>
  action(PICK_ITEM_AS_FAVORITE_SUCCESS, { item })

export const pickItemAsFavoriteFailure = (item: Item, error: string) =>
  action(PICK_ITEM_AS_FAVORITE_FAILURE, { item, error })

export type PickItemAsFavoriteRequestAction = ReturnType<
  typeof pickItemAsFavoriteRequest
>
export type PickItemAsFavoriteSuccessAction = ReturnType<
  typeof pickItemAsFavoriteSuccess
>
export type PickItemAsFavoriteFailureAction = ReturnType<
  typeof pickItemAsFavoriteFailure
>

// Cancel pick item as Favorite Request
export const CANCEL_PICK_ITEM_AS_FAVORITE =
  'Cancel pick item as Favorite Request'

export const cancelPickItemAsFavorite = () =>
  action(CANCEL_PICK_ITEM_AS_FAVORITE)

export type CancelPickItemAsFavoriteAction = ReturnType<
  typeof cancelPickItemAsFavorite
>

// Unpick item as Favorite Request
export const UNPICK_ITEM_AS_FAVORITE_REQUEST =
  '[Request] Unpick item as Favorite Request'
export const UNPICK_ITEM_AS_FAVORITE_SUCCESS =
  '[Success] Unpick item as Favorite Request'
export const UNPICK_ITEM_AS_FAVORITE_FAILURE =
  '[Failure] Unpick item as Favorite Request'

export const unpickItemAsFavoriteRequest = (item: Item) =>
  action(UNPICK_ITEM_AS_FAVORITE_REQUEST, { item })

export const unpickItemAsFavoriteSuccess = (item: Item) =>
  action(UNPICK_ITEM_AS_FAVORITE_SUCCESS, {
    item
  })

export const unpickItemAsFavoriteFailure = (item: Item, error: string) =>
  action(UNPICK_ITEM_AS_FAVORITE_FAILURE, { item, error })

export type UnpickItemAsFavoriteRequestAction = ReturnType<
  typeof unpickItemAsFavoriteRequest
>
export type UnpickItemAsFavoriteSuccessAction = ReturnType<
  typeof unpickItemAsFavoriteSuccess
>
export type UnpickItemAsFavoriteFailureAction = ReturnType<
  typeof unpickItemAsFavoriteFailure
>

// Undo unpicking item as Favorite Request
export const UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST =
  '[Request] Undo unpicking item as Favorite Request'
export const UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS =
  '[Success] Undo unpicking item as Favorite Request'
export const UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE =
  '[Failure] Undo unpicking item as Favorite Request'

export const undoUnpickingItemAsFavoriteRequest = (item: Item) =>
  action(UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST, { item })

export const undoUnpickingItemAsFavoriteSuccess = (item: Item) =>
  action(UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS, { item })

export const undoUnpickingItemAsFavoriteFailure = (item: Item, error: string) =>
  action(UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE, { item, error })

export type UndoUnpickingItemAsFavoriteRequestAction = ReturnType<
  typeof undoUnpickingItemAsFavoriteRequest
>
export type UndoUnpickingItemAsFavoriteSuccessAction = ReturnType<
  typeof undoUnpickingItemAsFavoriteSuccess
>
export type UndoUnpickingItemAsFavoriteFailureAction = ReturnType<
  typeof undoUnpickingItemAsFavoriteFailure
>

// Fetch Favorited Items

export const FETCH_FAVORITED_ITEMS_REQUEST = '[Request] Fetch Favorited Items'
export const FETCH_FAVORITED_ITEMS_SUCCESS = '[Success] Fetch Favorited Items'
export const FETCH_FAVORITED_ITEMS_FAILURE = '[Failure] Fetch Favorited Items'

export const fetchFavoritedItemsRequest = (
  options: ItemBrowseOptions,
  forceLoadMore?: boolean
) => action(FETCH_FAVORITED_ITEMS_REQUEST, { options, forceLoadMore })

export const fetchFavoritedItemsSuccess = (
  items: Item[],
  createdAt: Record<string, number>,
  total: number,
  options: ItemBrowseOptions,
  timestamp: number,
  forceLoadMore?: boolean
) =>
  action(FETCH_FAVORITED_ITEMS_SUCCESS, {
    options,
    items,
    createdAt,
    total,
    timestamp,
    forceLoadMore
  })

export const fetchFavoritedItemsFailure = (error: string) =>
  action(FETCH_FAVORITED_ITEMS_FAILURE, { error })

export type FetchFavoritedItemsRequestAction = ReturnType<
  typeof fetchFavoritedItemsRequest
>
export type FetchFavoritedItemsSuccessAction = ReturnType<
  typeof fetchFavoritedItemsSuccess
>
export type FetchFavoritedItemsFailureAction = ReturnType<
  typeof fetchFavoritedItemsFailure
>

// Fetch lists

export const FETCH_LISTS_REQUEST = '[Request] Fetch Lists'
export const FETCH_LISTS_SUCCESS = '[Success] Fetch Lists'
export const FETCH_LISTS_FAILURE = '[Failure] Fetch Lists'

export const fetchListsRequest = (options: ItemBrowseOptions) =>
  action(FETCH_LISTS_REQUEST, { options })

export const fetchListsSuccess = (
  lists: List[],
  total: number,
  options: ItemBrowseOptions
) =>
  action(FETCH_LISTS_SUCCESS, {
    lists,
    total,
    options
  })

export const fetchListsFailure = (error: string) =>
  action(FETCH_LISTS_FAILURE, { error })

export type FetchListsRequestAction = ReturnType<typeof fetchListsRequest>
export type FetchListsSuccessAction = ReturnType<typeof fetchListsSuccess>
export type FetchListsFailureAction = ReturnType<typeof fetchListsFailure>

// Delete list

export const DELETE_LIST_REQUEST = '[Request] Delete List'
export const DELETE_LIST_SUCCESS = '[Success] Delete List'
export const DELETE_LIST_FAILURE = '[Failure] Delete List'

export const deleteListRequest = (list: List) =>
  action(DELETE_LIST_REQUEST, { list })

export const deleteListSuccess = (list: List) =>
  action(DELETE_LIST_SUCCESS, {
    list
  })

export const deleteListFailure = (error: string) =>
  action(DELETE_LIST_FAILURE, { error })

export type DeleteListRequestAction = ReturnType<typeof deleteListRequest>
export type DeleteListSuccessAction = ReturnType<typeof deleteListSuccess>
export type DeleteListFailureAction = ReturnType<typeof deleteListFailure>

// Get List
export const GET_LIST_REQUEST = '[Request] Get List'
export const GET_LIST_SUCCESS = '[Success] Get List'
export const GET_LIST_FAILURE = '[Failure] Get List'

export const getListRequest = (id: string) => action(GET_LIST_REQUEST, { id })

export const getListSuccess = (list: List) =>
  action(GET_LIST_SUCCESS, {
    list
  })

export const getListFailure = (id: string, error: string) =>
  action(GET_LIST_FAILURE, { id, error })

export type GetListRequestAction = ReturnType<typeof getListRequest>
export type GetListSuccessAction = ReturnType<typeof getListSuccess>
export type GetListFailureAction = ReturnType<typeof getListFailure>
