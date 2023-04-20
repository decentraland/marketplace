import { View } from '../ui/types'
import { ItemFilters } from '../vendor/decentraland/item/types'
import { Section } from '../vendor/routing/types'

export type ItemBrowseOptions = {
  view?: View
  filters?: ItemFilters
  section?: Section
}
