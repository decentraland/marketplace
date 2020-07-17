import { NFTCategory } from '../nft/types'

export enum OrderStatus {
  OPEN = 'open',
  SOLD = 'sold',
  CANCELLED = 'cancelled'
}

export type Order = {
  id: string
  nftId: string
  category: NFTCategory
  nftAddress: string
  marketAddress: string
  owner: string
  buyer: string | null
  price: string
  ethPrice?: string
  status: OrderStatus
  expiresAt?: string
  createdAt: string
  updatedAt: string
}
