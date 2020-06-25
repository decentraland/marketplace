import { BaseNFTsParams } from '../../../nft/types'
import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../../../nft/wearable/types'
import { ContractName } from '../../types'

export type NFTsParams = BaseNFTsParams & {
  isLand?: boolean
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  wearableCategory?: WearableCategory
  wearableRarities?: WearableRarity[]
  wearableGenders?: WearableGender[]
  contracts?: ContractName[]
}
