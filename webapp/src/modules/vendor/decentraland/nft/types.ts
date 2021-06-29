import { Network } from '@dcl/schemas'
import { ENS } from '../../../nft/ens/types'
import { Estate } from '../../../nft/estate/types'
import { Parcel } from '../../../nft/parcel/types'
import {
  WearableCategory,
  WearableRarity,
  WearableGender,
  Wearable
} from '../../../nft/wearable/types'
import { NFT } from '../../../nft/types'
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

export type NFTData = {
  parcel?: Parcel
  estate?: Estate
  wearable?: Wearable
  ens?: ENS
}
