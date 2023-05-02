import { CatalogFilters, CatalogSortBy, ItemSortBy } from '@dcl/schemas'
import { View } from '../ui/types'
import { ItemFilters } from '../vendor/decentraland/item/types'
import { Section } from '../vendor/routing/types'

export type ItemBrowseOptions = {
  view?: View
  page?: number
  filters?: Omit<ItemFilters, 'sortBy'> &
    Omit<CatalogFilters, 'sortBy'> & {
      sortBy?: ItemSortBy | CatalogSortBy
    }
  section?: Section
}
