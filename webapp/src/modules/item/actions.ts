import { Item } from '@dcl/schemas'
import { action } from 'typesafe-actions'
import { ItemFilters } from '../vendor/decentraland/item/types'

export const FETCH_ITEMS_REQUEST = '[Request] Fetch Items'
export const FETCH_ITEMS_SUCCESS = '[Success] Fetch Items'
export const FETCH_ITEMS_FAILURE = '[Failure] Fetch Items'

export const fetchItemsRequest = (filters: ItemFilters) =>
  action(FETCH_ITEMS_REQUEST, { filters })

export const fetchItemsSuccess = (
  items: Item[],
  total: number,
  filters: ItemFilters
) => action(FETCH_ITEMS_SUCCESS, { items, total, filters })

export const fetchItemsFailure = (error: string, filters: ItemFilters) =>
  action(FETCH_ITEMS_FAILURE, { error, filters })

export type FetchItemsRequestAction = ReturnType<typeof fetchItemsRequest>
export type FetchItemsSuccessAction = ReturnType<typeof fetchItemsSuccess>
export type FetchItemsFailureAction = ReturnType<typeof fetchItemsFailure>
