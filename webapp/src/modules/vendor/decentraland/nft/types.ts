import {
  EmoteCategory,
  EmotePlayMode,
  GenderFilterOption,
  Network,
  NFT as BaseNFT,
  Order,
  Rarity,
  RentalListing,
  RentalStatus,
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
  emotePlayMode?: EmotePlayMode[]
  wearableGenders?: (WearableGender | GenderFilterOption)[]
  itemId?: string
  network?: Network
  tenant?: string
  rentalStatus?: RentalStatus | RentalStatus[]
  contracts?: string[]
  creator?: string | string[]
  minPrice?: string
  maxPrice?: string
  minEstateSize?: string
  maxEstateSize?: string
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
