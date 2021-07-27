import { View } from '../ui/types'
import { ItemFilters } from '../vendor/decentraland/item/types'

export type ItemBrowseOptions = {
  view?: View
  page?: number
  filters?: ItemFilters
}
