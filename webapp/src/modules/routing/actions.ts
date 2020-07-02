import { action } from 'typesafe-actions'

import { SearchOptions } from './types'

// Browse

export const BROWSE = 'Browse'

export const browse = (searchOptions: SearchOptions) =>
  action(BROWSE, { searchOptions })

export type BrowseAction = ReturnType<typeof browse>

// Load More

export const SET_IS_LOAD_MORE = 'Set is load more'

export const setIsLoadMore = (isLoadMore: boolean) =>
  action(SET_IS_LOAD_MORE, { isLoadMore })

export type SetIsLoadMoreAction = ReturnType<typeof setIsLoadMore>
