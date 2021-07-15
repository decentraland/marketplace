import { Network, Rarity } from '@dcl/schemas'
import { VendorName } from '../vendor/types'
import { Section } from '../vendor/routing/types'
import { View } from '../ui/types'
import { WearableGender } from '../nft/wearable/types'

export { Section } from '../vendor/routing/types'

export enum SortBy {
  NAME = 'name',
  NEWEST = 'newest',
  RECENTLY_LISTED = 'recently_listed',
  CHEAPEST = 'cheapest'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type SearchOptions = {
  view?: View
  vendor?: VendorName
  page?: number
  section?: Section
  sortBy?: SortBy
  onlyOnSale?: boolean
  isMap?: boolean
  isFullscreen?: boolean
  wearableRarities?: Rarity[]
  wearableGenders?: WearableGender[]
  search?: string
  contracts?: string[]
  address?: string
  network?: Network
}
