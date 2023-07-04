import { action } from 'typesafe-actions'
import { Item } from '@dcl/schemas'
import { ItemBrowseOptions } from '../item/types'
import {
  ListDetails,
  ListOfLists,
  UpdateOrCreateList
} from '../vendor/decentraland/favorites/types'
import {
  CreateListParameters,
  List,
  ListsBrowseOptions,
  UpdateListParameters
} from './types'

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

export const fetchListsRequest = (options: ListsBrowseOptions) =>
  action(FETCH_LISTS_REQUEST, { options })

export const fetchListsSuccess = (
  lists: ListOfLists[],
  items: Item[],
  total: number,
  options: ListsBrowseOptions
) =>
  action(FETCH_LISTS_SUCCESS, {
    lists,
    items,
    total,
    options
  })

export const fetchListsFailure = (error: string) =>
  action(FETCH_LISTS_FAILURE, { error })

export type FetchListsRequestAction = ReturnType<typeof fetchListsRequest>
export type FetchListsSuccessAction = ReturnType<typeof fetchListsSuccess>
export type FetchListsFailureAction = ReturnType<typeof fetchListsFailure>

// Delete list
export const DELETE_LIST_START = '[Start] Delete List'
export const DELETE_LIST_REQUEST = '[Request] Delete List'
export const DELETE_LIST_SUCCESS = '[Success] Delete List'
export const DELETE_LIST_FAILURE = '[Failure] Delete List'

export const deleteListStart = (list: List) =>
  action(DELETE_LIST_START, { list })

export const deleteListRequest = (list: List) =>
  action(DELETE_LIST_REQUEST, { list })

export const deleteListSuccess = (list: List) =>
  action(DELETE_LIST_SUCCESS, {
    list
  })

export const deleteListFailure = (list: List, error: string) =>
  action(DELETE_LIST_FAILURE, { list, error })

export type DeleteListStartAction = ReturnType<typeof deleteListStart>
export type DeleteListRequestAction = ReturnType<typeof deleteListRequest>
export type DeleteListSuccessAction = ReturnType<typeof deleteListSuccess>
export type DeleteListFailureAction = ReturnType<typeof deleteListFailure>

// Get List
export const GET_LIST_REQUEST = '[Request] Get List'
export const GET_LIST_SUCCESS = '[Success] Get List'
export const GET_LIST_FAILURE = '[Failure] Get List'

export const getListRequest = (id: string) => action(GET_LIST_REQUEST, { id })

export const getListSuccess = (list: ListDetails, items: Item[]) =>
  action(GET_LIST_SUCCESS, {
    list,
    items
  })

export const getListFailure = (id: string, error: string) =>
  action(GET_LIST_FAILURE, { id, error })

export type GetListRequestAction = ReturnType<typeof getListRequest>
export type GetListSuccessAction = ReturnType<typeof getListSuccess>
export type GetListFailureAction = ReturnType<typeof getListFailure>

// Update List
export const UPDATE_LIST_REQUEST = '[Request] Update List'
export const UPDATE_LIST_SUCCESS = '[Success] Update List'
export const UPDATE_LIST_FAILURE = '[Failure] Update List'

export const updateListRequest = (
  id: string,
  updatedList: UpdateListParameters
) => action(UPDATE_LIST_REQUEST, { id, updatedList })

export const updateListSuccess = (list: UpdateOrCreateList) =>
  action(UPDATE_LIST_SUCCESS, { list })

export const updateListFailure = (id: string, error: string) =>
  action(UPDATE_LIST_FAILURE, { id, error })

export type UpdateListRequestAction = ReturnType<typeof updateListRequest>
export type UpdateListSuccessAction = ReturnType<typeof updateListSuccess>
export type UpdateListFailureAction = ReturnType<typeof updateListFailure>

// Create List
export const CREATE_LIST_REQUEST = '[Request] Create List'
export const CREATE_LIST_SUCCESS = '[Success] Create List'
export const CREATE_LIST_FAILURE = '[Failure] Create List'
export const CREATE_LIST_CLEAR = '[Clear] Create List'

export const createListRequest = ({
  name,
  isPrivate,
  description
}: CreateListParameters) =>
  action(CREATE_LIST_REQUEST, { name, description, isPrivate })

export const createListSuccess = (list: UpdateOrCreateList) =>
  action(CREATE_LIST_SUCCESS, { list })

export const createListFailure = (error: string) =>
  action(CREATE_LIST_FAILURE, { error })

export const createListClear = () => action(CREATE_LIST_CLEAR)

export type CreateListRequestAction = ReturnType<typeof createListRequest>
export type CreateListSuccessAction = ReturnType<typeof createListSuccess>
export type CreateListFailureAction = ReturnType<typeof createListFailure>
export type CreateListClearAction = ReturnType<typeof createListClear>

// Bulk picking and unpicking
export const BULK_PICK_START = '[Start] Bulk pick'
export const BULK_PICK_REQUEST = '[Request] Bulk pick'
export const BULK_PICK_SUCCESS = '[Success] Bulk pick'
export const BULK_PICK_FAILURE = '[Failure] Bulk pick'
export const BULK_PICK_CANCEL = '[Cancel] Bulk pick'

export const bulkPickUnpickStart = (item: Item) =>
  action(BULK_PICK_START, { item })

export const bulkPickUnpickRequest = (
  item: Item,
  pickedFor: ListOfLists[],
  unpickedFrom: ListOfLists[]
) => action(BULK_PICK_REQUEST, { item, pickedFor, unpickedFrom })

export const bulkPickUnpickSuccess = (
  item: Item,
  pickedFor: ListOfLists[],
  unpickedFrom: ListOfLists[],
  isPickedByUser: boolean,
  ownerRemovedFromCurrentList: boolean
) =>
  action(BULK_PICK_SUCCESS, {
    item,
    pickedFor,
    unpickedFrom,
    isPickedByUser,
    ownerRemovedFromCurrentList
  })

export const bulkPickUnpickFailure = (
  item: Item,
  pickedFor: ListOfLists[],
  unpickedFrom: ListOfLists[],
  error: string
) => action(BULK_PICK_FAILURE, { item, pickedFor, unpickedFrom, error })

export const bulkPickUnpickCancel = (item: Item, error?: string) =>
  action(BULK_PICK_CANCEL, { item, error })

export type BulkPickUnpickStartAction = ReturnType<typeof bulkPickUnpickStart>

export type BulkPickUnpickRequestAction = ReturnType<
  typeof bulkPickUnpickRequest
>
export type BulkPickUnpickSuccessAction = ReturnType<
  typeof bulkPickUnpickSuccess
>
export type BulkPickUnpickFailureAction = ReturnType<
  typeof bulkPickUnpickFailure
>

export type BulkPickUnpickCancelAction = ReturnType<typeof bulkPickUnpickCancel>

// Actions to track bulk picks and unpicks
export const PICK_ITEM_SUCCESS = '[Tracking] Pick item success'
export const PICK_ITEM_FAILURE = '[Tracking] Pick item failure'
export const UNPICK_ITEM_SUCCESS = '[Tracking] Unpick item success'
export const UNPICK_ITEM_FAILURE = '[Tracking] Unpick item failure'

export const pickItemSuccess = (item: Item, listId: string) =>
  action(PICK_ITEM_SUCCESS, {
    item,
    listId
  })

export const pickItemFailure = (item: Item, listId: string, error: string) =>
  action(PICK_ITEM_FAILURE, {
    item,
    listId,
    error
  })

export const unpickItemSuccess = (item: Item, listId: string) =>
  action(UNPICK_ITEM_SUCCESS, {
    item,
    listId
  })

export const unpickItemFailure = (item: Item, listId: string, error: string) =>
  action(UNPICK_ITEM_FAILURE, {
    item,
    listId,
    error
  })

export type PickItemSuccessAction = ReturnType<typeof pickItemSuccess>
export type PickItemFailureAction = ReturnType<typeof pickItemFailure>
export type UnpickItemSuccessAction = ReturnType<typeof unpickItemSuccess>
export type UnpickItemFailureAction = ReturnType<typeof unpickItemFailure>
