import { Parcel } from './parcel/types'
import { Estate } from './estate/types'
import { Wearable } from './wearable/types'

export type NFT = {
  id: string
  activeOrderId: string | null
  name: string
  description: string
  image: string
  parcel: Parcel
  estate: Estate
  wearable: Wearable
}
