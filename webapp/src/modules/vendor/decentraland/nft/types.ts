import {
  Network,
  NFT as BaseNFT,
  Order,
  Rarity,
  WearableCategory
} from '@dcl/schemas'
import { WearableGender } from '../../../nft/wearable/types'
import { NFT } from '../../../nft/types'
import { VendorName } from '../../types'

export type NFTsFetchFilters = {
  isLand?: boolean
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  wearableCategory?: WearableCategory
  wearableRarities?: Rarity[]
  wearableGenders?: WearableGender[]
  itemId?: string
  contracts?: string[]
  network?: Network
}

export type NFTResult = {
  nft: Omit<NFT<VendorName.DECENTRALAND>, 'vendor'>
  order: Order | null
}

export type NFTResponse = {
  data: NFTResult[]
  total: number
}

export type NFTData = BaseNFT['data']
