import { Parcel } from './parcel/types'
import { Estate } from './estate/types'
import { Wearable } from './wearable/types'

export enum NFTCategory {
  PARCEL = 'parcel',
  ESTATE = 'estate',
  WEARABLE = 'wearable'
}

export type NFT = {
  id: string
  contractAddress: string
  tokenId: string
  activeOrderId: string | null
  name: string
  category: NFTCategory
  image: string
  parcel: Parcel | null
  estate: Estate | null
  wearable: Wearable | null
  owner: {
    id: string
  }
}
