import { action } from 'typesafe-actions'
import { ItemBrowseOptions } from '../item/types'

import { NFTBrowseOptions } from './types'

// Browse NFTs

export const BROWSE_NFTS = 'Browse NFTs'

export const browseNFTs = (searchOptions: NFTBrowseOptions) =>
  action(BROWSE_NFTS, { searchOptions })

export type BrowseNFTsAction = ReturnType<typeof browseNFTs>

// Navigate

export const FETCH_NFTS_FROM_ROUTE = 'Fetch NFTs from route'

export const fetchNFTsFromRoute = (searchOptions: NFTBrowseOptions) =>
  action(FETCH_NFTS_FROM_ROUTE, { searchOptions })

export type FetchNFTsFromRouteAction = ReturnType<typeof fetchNFTsFromRoute>

// Browse Items

export const BROWSE_ITEMS = 'Browse items'

export const browseItems = (options: ItemBrowseOptions) =>
  action(BROWSE_ITEMS, options)

export type BrowseItemsAction = ReturnType<typeof browseItems>

// Navigate

export const FETCH_ITEMS_FROM_ROUTE = 'Fetch items from route'

export const fetchItemsFromRoute = (options: ItemBrowseOptions) =>
  action(FETCH_ITEMS_FROM_ROUTE, options)

export type FetchItemsFromRouteAction = ReturnType<typeof fetchItemsFromRoute>

// Load More

export const SET_IS_LOAD_MORE = 'Set is load more'

export const setIsLoadMore = (isLoadMore: boolean) =>
  action(SET_IS_LOAD_MORE, { isLoadMore })

export type SetIsLoadMoreAction = ReturnType<typeof setIsLoadMore>
