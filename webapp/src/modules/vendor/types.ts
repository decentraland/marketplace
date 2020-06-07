import { SortDirection } from '../routing/search'
import { NFTSortBy, NFTCategory } from '../nft/types'
import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../nft/wearable/types'
import { ContractName } from '../contract/types'
import { View } from '../ui/types'

export enum Vendors {
  DECENTRALAND = 'decentraland',
  SUPERRARE = 'superrare'
}

export type FetchNFTsOptions = {
  variables: {
    first: number
    skip: number
    orderBy?: NFTSortBy
    orderDirection?: SortDirection
    address?: string
    onlyOnSale: boolean
    isLand?: boolean
    isWearableHead?: boolean
    isWearableAccessory?: boolean
    category?: NFTCategory
    wearableCategory?: WearableCategory
    wearableRarities?: WearableRarity[]
    wearableGenders?: WearableGender[]
    search?: string
    contracts?: ContractName[]
  }
  view?: View
}
