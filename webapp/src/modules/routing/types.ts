import {
  EmotePlayMode,
  Network,
  NFTCategory,
  Rarity,
  RentalStatus,
  WearableGender,
  GenderFilterOption
} from '@dcl/schemas'
import { AssetType } from '../asset/types'
import { VendorName } from '../vendor/types'
import { View } from '../ui/types'

export { Sections } from '../vendor/routing/types'

export enum SortBy {
  NAME = 'name',
  NEWEST = 'newest',
  RECENTLY_LISTED = 'recently_listed',
  CHEAPEST = 'cheapest',
  RECENTLY_REVIEWED = 'recently_reviewed',
  RECENTLY_SOLD = 'recently_sold',
  SIZE = 'size',
  RENTAL_LISTING_DATE = 'rental_listing_date',
  RENTAL_DATE = 'rented_date',
  MAX_RENTAL_PRICE = 'max_rental_price',
  MIN_RENTAL_PRICE = 'min_rental_price'
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
  onlyOnRent?: boolean
  onlySmart?: boolean
  isMap?: boolean
  isFullscreen?: boolean
  rarities?: Rarity[]
  wearableGenders?: (WearableGender | GenderFilterOption)[]
  search?: string
  contracts?: string[]
  address?: string
  network?: Network
  tenant?: string
  rentalStatus?: RentalStatus[]
  viewAsGuest?: boolean
  category?: NFTCategory
  emotePlayMode?: EmotePlayMode[]
  minPrice?: string
  maxPrice?: string
  minEstateSize?: string
  maxEstateSize?: string
}
