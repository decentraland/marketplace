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
  activeOrderId: string | null
  name: string
  description: string
  category: NFTCategory
  image: string
  parcel: Parcel
  estate: Estate
  wearable: Wearable
}
