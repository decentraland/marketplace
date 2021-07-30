import { ChainId, Item } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { action } from 'typesafe-actions'
import { ItemBrowseOptions } from './types'

// Fetch Item

export const FETCH_ITEMS_REQUEST = '[Request] Fetch Items'
export const FETCH_ITEMS_SUCCESS = '[Success] Fetch Items'
export const FETCH_ITEMS_FAILURE = '[Failure] Fetch Items'

export const fetchItemsRequest = (options: ItemBrowseOptions) =>
  action(FETCH_ITEMS_REQUEST, options)

export const fetchItemsSuccess = (
  items: Item[],
  total: number,
  options: ItemBrowseOptions,
  timestamp: number
) => action(FETCH_ITEMS_SUCCESS, { items, total, options, timestamp })

export const fetchItemsFailure = (error: string, options: ItemBrowseOptions) =>
  action(FETCH_ITEMS_FAILURE, { error, options })

export type FetchItemsRequestAction = ReturnType<typeof fetchItemsRequest>
export type FetchItemsSuccessAction = ReturnType<typeof fetchItemsSuccess>
export type FetchItemsFailureAction = ReturnType<typeof fetchItemsFailure>

// Buy Item
export const BUY_ITEM_REQUEST = '[Request] Buy item'
export const BUY_ITEM_SUCCESS = '[Success] Buy item'
export const BUY_ITEM_FAILURE = '[Failure] Buy item'

export const buyItemRequest = (item: Item) => action(BUY_ITEM_REQUEST, { item })

export const buyItemSuccess = (chainId: ChainId, txHash: string, item: Item) =>
  action(BUY_ITEM_SUCCESS, {
    ...buildTransactionPayload(chainId, txHash, { item })
  })

export const buyItemFailure = (error: string) =>
  action(BUY_ITEM_FAILURE, { error })

export type buyItemRequestAction = ReturnType<typeof buyItemRequest>
export type buyItemSuccessAction = ReturnType<typeof buyItemSuccess>
export type buyItemFailureAction = ReturnType<typeof buyItemFailure>
