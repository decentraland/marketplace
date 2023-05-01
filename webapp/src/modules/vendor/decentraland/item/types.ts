import {
  CatalogSortBy,
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
import { SortBy } from '../../../routing/types'

export type ItemFilters = {
  first?: number
  skip?: number
  // sortBy?: SortBy
  sortBy?: ItemSortBy | CatalogSortBy
  onlyMinting?: boolean;
  onlyListing?: boolean;
  creator?: string | string[]
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
  ids?: string[]
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
