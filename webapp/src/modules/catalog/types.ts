import {
  CatalogFilters,
  CatalogSortBy,
  CatalogSortDirection,
  Item
} from '@dcl/schemas'

export type CatalogData = Pick<
  Item,
  'minPrice' | 'maxListingPrice' | 'minListingPrice' | 'owners' | 'listings'
>

export type CatalogQueryFilters = Omit<
  CatalogFilters,
  'sortBy' | 'sortDirection' | 'limit' | 'offset'
> & {
  sortBy?: CatalogSortBy
  sortDirection?: CatalogSortDirection
  limit?: number
  offset?: number
}
