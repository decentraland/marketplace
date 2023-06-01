import { SortDirection } from '../routing/types'
import { ListsSortBy } from '../vendor/decentraland/favorites/types'
import { ListsBrowseSortBy } from './types'

export function convertListsBrowseSortByIntoApiSortBy(
  sortBy: ListsBrowseSortBy
): { sortBy: ListsSortBy; sortDirection: SortDirection } {
  switch (sortBy) {
    case ListsBrowseSortBy.NAME_ASC:
      return { sortBy: ListsSortBy.NAME, sortDirection: SortDirection.ASC }
    case ListsBrowseSortBy.NAME_DESC:
      return { sortBy: ListsSortBy.NAME, sortDirection: SortDirection.DESC }
    case ListsBrowseSortBy.NEWEST:
      return {
        sortBy: ListsSortBy.CREATED_AT,
        sortDirection: SortDirection.DESC
      }
    case ListsBrowseSortBy.OLDEST:
      return {
        sortBy: ListsSortBy.CREATED_AT,
        sortDirection: SortDirection.ASC
      }
    case ListsBrowseSortBy.RECENTLY_UPDATED:
      return {
        sortBy: ListsSortBy.UPDATED_AT,
        sortDirection: SortDirection.DESC
      }
    default:
      throw Error('Wrong sortBy value')
  }
}
