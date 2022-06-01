import { ChainId, Item } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { action } from 'typesafe-actions'
import { formatWeiMANA } from '../../lib/mana'
import { getAssetName } from '../asset/utils'
import { ItemBrowseOptions } from './types'

// Fetch Items

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

// Fetch trending Items

export const FETCH_TRENDING_ITEMS_REQUEST = '[Request] Fetch Trending Items'
export const FETCH_TRENDING_ITEMS_SUCCESS = '[Success] Fetch Trending Items'
export const FETCH_TRENDING_ITEMS_FAILURE = '[Failure] Fetch Trending Items'

export const fetchTrendingItemsRequest = (size?: number) =>
  action(FETCH_TRENDING_ITEMS_REQUEST, { size })

export const fetchTrendingItemsSuccess = (items: Item[]) =>
  action(FETCH_TRENDING_ITEMS_SUCCESS, { items })

export const fetchTrendingItemsFailure = (error: string) =>
  action(FETCH_TRENDING_ITEMS_FAILURE, { error })

export type FetchTrendingItemsRequestAction = ReturnType<
  typeof fetchTrendingItemsRequest
>
export type FetchTrendingItemsSuccessAction = ReturnType<
  typeof fetchTrendingItemsSuccess
>
export type FetchTrendingItemsFailureAction = ReturnType<
  typeof fetchTrendingItemsFailure
>

// Buy Item
export const BUY_ITEM_REQUEST = '[Request] Buy item'
export const BUY_ITEM_SUCCESS = '[Success] Buy item'
export const BUY_ITEM_FAILURE = '[Failure] Buy item'

export const buyItemRequest = (item: Item) => action(BUY_ITEM_REQUEST, { item })

export const buyItemSuccess = (chainId: ChainId, txHash: string, item: Item) =>
  action(BUY_ITEM_SUCCESS, {
    item,
    ...buildTransactionPayload(chainId, txHash, {
      itemId: item.itemId,
      contractAddress: item.contractAddress,
      network: item.network,
      name: getAssetName(item),
      price: formatWeiMANA(item.price)
    })
  })

export const buyItemFailure = (error: string) =>
  action(BUY_ITEM_FAILURE, { error })

export type BuyItemRequestAction = ReturnType<typeof buyItemRequest>
export type BuyItemSuccessAction = ReturnType<typeof buyItemSuccess>
export type BuyItemFailureAction = ReturnType<typeof buyItemFailure>

// Fetch Item

export const FETCH_ITEM_REQUEST = '[Request] Fetch Item'
export const FETCH_ITEM_SUCCESS = '[Success] Fetch Item'
export const FETCH_ITEM_FAILURE = '[Failure] Fetch Item'

export const fetchItemRequest = (contractAddress: string, tokenId: string) =>
  action(FETCH_ITEM_REQUEST, { contractAddress, tokenId })
export const fetchItemSuccess = (item: Item) =>
  action(FETCH_ITEM_SUCCESS, { item })
export const fetchItemFailure = (
  contractAddress: string,
  tokenId: string,
  error: string
) => action(FETCH_ITEM_FAILURE, { contractAddress, tokenId, error })

export type FetchItemRequestAction = ReturnType<typeof fetchItemRequest>
export type FetchItemSuccessAction = ReturnType<typeof fetchItemSuccess>
export type FetchItemFailureAction = ReturnType<typeof fetchItemFailure>
