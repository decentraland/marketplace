import { Network } from '@dcl/schemas'
import { NFT } from '../../../nft/types'
import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../../../nft/wearable/types'
import { Order } from '../../../order/types'
import { Vendors } from '../../types'
import { ContractName } from '../ContractService'

export type NFTsFetchFilters = {
  isLand?: boolean
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  wearableCategory?: WearableCategory
  wearableRarities?: WearableRarity[]
  wearableGenders?: WearableGender[]
  contracts?: ContractName[]
  network?: Network
}

export type NFTsFetchResponse = {
  nfts: Omit<NFT<Vendors.DECENTRALAND>, 'vendor'>[]
  orders: Order[]
  total: number
}
