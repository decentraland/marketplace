import { Item, ItemSortBy, CatalogSortBy, ItemFilters as ItemFiltersSchema } from '@dcl/schemas'

export type ItemFilters = Omit<ItemFiltersSchema, 'sortBy'> & {
  sortBy?: ItemSortBy | CatalogSortBy
}

export type ItemResponse = {
  data: Item[]
  total: number
}
