import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../../../nft/wearable/types'
import { ContractName } from '../../types'

export type NFTsParams = {
  isLand?: boolean
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  wearableCategory?: WearableCategory
  wearableRarities?: WearableRarity[]
  wearableGenders?: WearableGender[]
  contracts?: ContractName[]
}
