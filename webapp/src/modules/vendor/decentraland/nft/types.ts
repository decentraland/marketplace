import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../../../nft/wearable/types'
import { ContractName } from '../ContractService'

export type NFTsFetchFilters = {
  isLand?: boolean
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  wearableCategory?: WearableCategory
  wearableRarities?: WearableRarity[]
  wearableGenders?: WearableGender[]
  contracts?: ContractName[]
}

export enum NFTCategory {
  PARCEL = 'parcel',
  ESTATE = 'estate',
  WEARABLE = 'wearable',
  ENS = 'ens'
}
