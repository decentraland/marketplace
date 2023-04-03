import { action } from 'typesafe-actions'
import { Item } from '@dcl/schemas'
import { FavoritedItemIds } from './types'
import { ItemBrowseOptions } from '../item/types'

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
  action(UNPICK_ITEM_AS_FAVORITE_SUCCESS, { item })

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

export const fetchFavoritedItemsRequest = (options: ItemBrowseOptions) =>
  action(FETCH_FAVORITED_ITEMS_REQUEST, options)

export const fetchFavoritedItemsSuccess = (
  itemIds: FavoritedItemIds,
  total: number
) => action(FETCH_FAVORITED_ITEMS_SUCCESS, { itemIds, total })

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
