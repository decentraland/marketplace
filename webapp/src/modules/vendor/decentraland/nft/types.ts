import { Network } from '@dcl/schemas'
import { NFT } from '../../../nft/types'
import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../../../nft/wearable/types'
import { Order } from '../../../order/types'
import { VendorName } from '../../types'

export type NFTsFetchFilters = {
  isLand?: boolean
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  wearableCategory?: WearableCategory
  wearableRarities?: WearableRarity[]
  wearableGenders?: WearableGender[]
  contracts?: string[]
  network?: Network
}

export type NFTListFetchResponse = {
  nfts: Omit<NFT<VendorName.DECENTRALAND>, 'vendor'>[]
  orders: Order[]
  total: number
}

export type NFTFetchReponse = {
  nft: Omit<NFT<VendorName.DECENTRALAND>, 'vendor'>
  order: Order | null
}
