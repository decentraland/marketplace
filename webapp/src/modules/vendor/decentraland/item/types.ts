import {
  EmoteCategory,
  EmotePlayMode,
  Item,
  ItemSortBy,
  Network,
  NFTCategory,
  Rarity,
  WearableCategory
} from '@dcl/schemas'
import { WearableGender } from '../../../nft/wearable/types'

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
  emotePlayMode?: EmotePlayMode
  rarities?: Rarity[]
  wearableGenders?: WearableGender[]
  contracts?: string[]
  itemId?: string
  network?: Network
}

export type ItemResponse = {
  data: Item[]
  total: number
}
