import { NFTSortBy, NFTCategory } from '../nft/types'
import { SortDirection } from '../routing/search'
import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../nft/wearable/types'
import { ContractName } from '../contract/types'
import { View } from '../ui/types'
import { NFT } from '../../modules/nft/types'
import { Account } from '../../modules/account/types'
import { Order } from '../../modules/order/types'

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

export interface NFTService {
  fetch: (
    options: FetchNFTsOptions
  ) => Promise<readonly [NFT[], Account[], Order[], number]>
  fetchOne: (
    contractAddress: string,
    tokenId: string
  ) => Promise<readonly [NFT, Order | undefined]>
}
export class NFTService {}
