import { SortDirection } from '../routing/search'
import { NFTSortBy, NFTCategory } from '../nft/types'
import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../nft/wearable/types'
import { View } from '../ui/types'
import * as decentraland from './decentraland'
import * as superrare from './superrare'

export enum Vendors {
  DECENTRALAND = 'decentraland',
  SUPER_RARE = 'superrare',
  KNOWN_ORIGIN = 'knownorigin',
  MAKERS_PLACE = 'makersplace'
}

export type ContractName =
  | keyof typeof decentraland.ContractService['contractAddresses']
  | keyof typeof superrare.ContractService['contractAddresses']

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
  vendor?: Vendors
  view?: View
}
