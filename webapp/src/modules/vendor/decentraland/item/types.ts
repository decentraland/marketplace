import {
  Item,
  ItemSortBy,
  CatalogSortBy,
  ItemFilters as ItemFiltersSchema
} from '@dcl/schemas'

// export type ItemFilters = {
//   first?: number
//   skip?: number
//   sortBy?: ItemSortBy
//   creator?: string | string[]
//   category?: NFTCategory
//   isSoldOut?: boolean
//   isOnSale?: boolean
//   isOnRent?: boolean
//   search?: string
//   isWearableHead?: boolean
//   isWearableAccessory?: boolean
//   isWearableSmart?: boolean
//   wearableCategory?: WearableCategory
//   emoteCategory?: EmoteCategory
//   emotePlayMode?: EmotePlayMode[]
//   rarities?: Rarity[]
//   wearableGenders?: (WearableGender | GenderFilterOption)[]
//   ids?: string[]
//   contracts?: string[]
//   itemId?: string
//   network?: Network
//   minPrice?: string
//   maxPrice?: string

export type ItemFilters = Omit<ItemFiltersSchema, 'sortBy'> & {
  sortBy?: ItemSortBy | CatalogSortBy
}

// export type ItemFilters = {
//   first?: number
//   skip?: number
//   // sortBy?: SortBy
//   sortBy?: ItemSortBy | CatalogSortBy
//   onlyMinting?: boolean;
//   onlyListing?: boolean;
//   creator?: string | string[]
//   category?: NFTCategory
//   isSoldOut?: boolean
//   isOnSale?: boolean
//   isOnRent?: boolean
//   search?: string
//   isWearableHead?: boolean
//   isWearableAccessory?: boolean
//   isWearableSmart?: boolean
//   wearableCategory?: WearableCategory
//   emoteCategory?: EmoteCategory
//   emotePlayMode?: EmotePlayMode[]
//   rarities?: Rarity[]
//   wearableGenders?: (WearableGender | GenderFilterOption)[]
//   ids?: string[]
//   contracts?: string[]
//   itemId?: string
//   network?: Network
//   minPrice?: string
//   maxPrice?: string
// }

export type ItemResponse = {
  data: Item[]
  total: number
}
