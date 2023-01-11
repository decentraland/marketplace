import {
  EmoteCategory,
  EmotePlayMode,
  GenderFilterOption,
  Item,
  ItemSortBy,
  Network,
  NFTCategory,
  Rarity,
  WearableCategory,
  WearableGender
} from '@dcl/schemas'

export type ItemFilters = {
  first?: number
  skip?: number
  sortBy?: ItemSortBy
  creator?: string
  category?: NFTCategory
  isSoldOut?: boolean
  isOnSale?: boolean
  isOnRent?: boolean
  search?: string
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  isWearableSmart?: boolean
  wearableCategory?: WearableCategory
  emoteCategory?: EmoteCategory
  emotePlayMode?: EmotePlayMode[]
  rarities?: Rarity[]
  wearableGenders?: (WearableGender | GenderFilterOption)[]
  contracts?: string[]
  itemId?: string
  network?: Network
  minPrice?: string
  maxPrice?: string
}

export type ItemResponse = {
  data: Item[]
  total: number
}
