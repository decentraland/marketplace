import { NFT } from '../nft/types'

export enum OrderCategory {
  PARCEL = 'parcel',
  ESTATE = 'estate',
  WEARABLE = 'wearable'
}

export type OrderStatus = 'open' | 'sold' | 'cancelled'

export type Order = {
  id: string
  nft: NFT
  category: OrderCategory
  nftAddress: string
  owner: string
  buyer: string | null
  price: string
  status: OrderStatus
  expiresAt: string
  createdAt: string
  updatedAt: string
}
