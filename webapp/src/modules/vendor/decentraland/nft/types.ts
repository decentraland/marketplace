import {
  EmoteCategory,
  Network,
  NFT as BaseNFT,
  Order,
  Rarity,
  RentalListing,
  WearableCategory
} from '@dcl/schemas'
import { WearableGender } from '../../../nft/wearable/types'
import { NFT } from '../../../nft/types'
import { VendorName } from '../../types'

export type NFTsFetchFilters = {
  isLand?: boolean
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  isWearableSmart?: boolean
  rarities?: Rarity[]
  wearableCategory?: WearableCategory
  emoteCategory?: EmoteCategory
  wearableGenders?: WearableGender[]
  itemId?: string
  contracts?: string[]
  network?: Network
}

export type NFTResult = {
  nft: Omit<NFT<VendorName.DECENTRALAND>, 'vendor'>
  order: Order | null
  rental: RentalListing | null
}

export type NFTResponse = {
  data: NFTResult[]
  total: number
}

export type NFTData = BaseNFT['data']
