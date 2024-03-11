import { EmotePlayMode, Network, NFTCategory, Rarity, RentalStatus, WearableGender, GenderFilterOption } from '@dcl/schemas'
import { AssetStatusFilter } from '../../utils/filters'
import { AssetType } from '../asset/types'
import { VendorName } from '../vendor/types'
import { View } from '../ui/types'

export { Sections } from '../vendor/routing/types'

export enum SortBy {
  NAME = 'name',
  NEWEST = 'newest',
  RECENTLY_LISTED = 'recently_listed',
  CHEAPEST = 'cheapest',
  MOST_EXPENSIVE = 'most_expensive',
  RECENTLY_REVIEWED = 'recently_reviewed',
  RECENTLY_SOLD = 'recently_sold',
  SIZE = 'size',
  RENTAL_LISTING_DATE = 'rental_listing_date',
  RENTAL_DATE = 'rented_date',
  MAX_RENTAL_PRICE = 'max_rental_price',
  MIN_RENTAL_PRICE = 'min_rental_price',
  CHEAPEST_SALE = 'cheapest_sale',
  CHEAPEST_RENT = 'cheapest_rent'
}

export type SortByOption = {
  value: SortBy
  text: string
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
  status?: AssetStatusFilter
  wearableGenders?: (WearableGender | GenderFilterOption)[]
  search?: string
  contracts?: string[]
  creators?: string[]
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
  rentalDays?: number[]
  minDistanceToPlaza?: string
  maxDistanceToPlaza?: string
  adjacentToRoad?: boolean
  emoteHasSound?: boolean
  emoteHasGeometry?: boolean
}

export enum PageName {
  HOME,
  SIGN_IN,
  SETTINGS,
  LANDS,
  NAMES,
  MINT_NAME,
  COLLECTION,
  BROWSE,
  CAMPAIGN,
  ACCOUNT,
  LISTS,
  LIST,
  ACCOUNTS,
  NFT_DETAIL,
  MANAGE_NFT,
  ITEM_DETAIL,
  PARCEL_DETAIL,
  ESTATE_DETAIL,
  BUY_NFT,
  BUY_ITEM,
  BUY_NFT_STATUS,
  BUY_ITEM_STATUS,
  CANCEL_NFT_SALE,
  TRANSFER_NFT,
  BID_NFT,
  ACTIVITY
}
