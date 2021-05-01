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

export type NFTListFetchResponse = {
  nfts: Omit<NFT<Vendors.DECENTRALAND>, 'vendor'>[]
  orders: Order[]
  total: number
}

export type NFTFetchReponse = {
  nft: Omit<NFT<Vendors.DECENTRALAND>, 'vendor'>
  order: Order | null
}

export type Collection = {
  name: string
  address: string
  network: Network
}
