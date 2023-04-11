import { Item, ItemFilters, Network } from '@dcl/schemas'

export type CollectionsItemDBResult = {
  id: string
  thumbnail: string
  collection: string
  blockchain_id: string
  rarity: string
  item_type: string
  price: string
  available: string
  search_is_store_minter: boolean
  creator: string
  beneficiary: string
  created_at: string
  updated_at: string
  reviewed_at: string
  sold_at: string
  first_listed_at: string
  min_listing_price: string | null
  max_listing_price: string | null
  listings_count: number | null
  owners_count: number | null
  min_price: string
  max_price: string
  network?: Network
  metadata: {
    id: string
    description: string
    category: string
    body_shapes: string[]
    rarity: string
    name: string
    loop?: boolean
  }
}

export type CatalogItem = Pick<
  Item,
  | 'id'
  | 'name'
  | 'contractAddress'
  | 'thumbnail'
  | 'url'
  | 'rarity'
  | 'category'
  | 'creator'
  | 'data'
  | 'network'
  | 'chainId'
  | 'available'
  | 'isOnSale'
  | 'price'
> & {
  minPrice: string
  minListingPrice: string | null
  maxListingPrice: string | null
  listings: number | null
  owners: number | null
}

export enum CatalogSortBy {
  NEWEST = 'newest',
  RECENTLY_SOLD = 'recently_sold',
  CHEAPEST = 'cheapest',
  MOST_EXPENSIVE = 'most_expensive',
  RECENTLY_LISTED = 'recently_listed'
}

export enum CatalogSortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type CatalogFilters = Pick<
  ItemFilters,
  | 'first'
  | 'skip'
  | 'category'
  | 'creator'
  | 'isSoldOut'
  | 'isOnSale'
  | 'search'
  | 'isWearableHead'
  | 'isWearableSmart'
  | 'isWearableAccessory'
  | 'isWearableAccessory'
  | 'wearableCategory'
  | 'rarities'
  | 'wearableGenders'
  | 'emoteCategory'
  | 'emoteGenders'
  | 'emotePlayMode'
  | 'contractAddresses'
  | 'itemId'
  | 'network'
  | 'minPrice'
  | 'maxPrice'
> & {
  onlyMinting?: boolean
  onlyListing?: boolean
  sortBy?: CatalogSortBy
  sortDirection?: CatalogSortDirection
  limit?: number
  offset?: number
}

export type CatalogQueryFilters = Omit<
  CatalogFilters,
  'sortBy' | 'sortDirection' | 'limit' | 'offset'
> & {
  sortBy?: CatalogSortBy
  sortDirection?: CatalogSortDirection
  limit?: number
  offset?: number
}
