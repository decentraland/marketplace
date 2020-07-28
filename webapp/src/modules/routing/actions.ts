import { action } from 'typesafe-actions'

import { SearchOptions } from './types'

// Browse

export const BROWSE = 'Browse'

export const browse = (searchOptions: SearchOptions) =>
  action(BROWSE, { searchOptions })

export type BrowseAction = ReturnType<typeof browse>

// Navigate

export const FETCH_NFTS_FROM_ROUTE = 'Fetch NFTs from route'

export const fetchNFTsFromRoute = (searchOptions: SearchOptions) =>
  action(FETCH_NFTS_FROM_ROUTE, { searchOptions })

export type FetchNFTsFromRouteAction = ReturnType<typeof fetchNFTsFromRoute>

// Load More

export const SET_IS_LOAD_MORE = 'Set is load more'

export const setIsLoadMore = (isLoadMore: boolean) =>
  action(SET_IS_LOAD_MORE, { isLoadMore })

export type SetIsLoadMoreAction = ReturnType<typeof setIsLoadMore>
