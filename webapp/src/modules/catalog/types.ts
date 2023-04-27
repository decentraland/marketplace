import {
  CatalogFilters,
  CatalogSortBy,
  CatalogSortDirection
} from '@dcl/schemas'

export type CatalogQueryFilters = Omit<
  CatalogFilters,
  'sortBy' | 'sortDirection' | 'limit' | 'offset'
> & {
  sortBy?: CatalogSortBy
  sortDirection?: CatalogSortDirection
  limit?: number
  offset?: number
}
