import { Network, Rarity } from '@dcl/schemas'
import { AssetType } from '../asset/types'
import { VendorName } from '../vendor/types'
import { View } from '../ui/types'
import { WearableGender } from '../nft/wearable/types'

export { Sections } from '../vendor/routing/types'

export enum SortBy {
  NAME = 'name',
  NEWEST = 'newest',
  RECENTLY_LISTED = 'recently_listed',
  CHEAPEST = 'cheapest',
  RECENTLY_REVIEWED = 'recently_reviewed',
  RECENTLY_SOLD = 'recently_sold',
  SIZE = 'size'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type BrowseOptions = {
  assetType?: AssetType
  view?: View
  vendor?: VendorName
  page?: number
  section?: string
  sortBy?: SortBy
  onlyOnSale?: boolean
  onlySmart?: boolean
  isMap?: boolean
  isFullscreen?: boolean
  rarities?: Rarity[]
  wearableGenders?: WearableGender[]
  search?: string
  contracts?: string[]
  address?: string
  network?: Network
  viewAsGuest?: boolean
}
