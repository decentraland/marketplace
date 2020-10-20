import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../../../nft/wearable/types'

export type NFTsFetchFilters = {
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  wearableCategory?: WearableCategory
  wearableRarities?: WearableRarity[]
  wearableGenders?: WearableGender[]
  contracts?: string[]
}
