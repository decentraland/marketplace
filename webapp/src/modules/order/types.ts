import { NFTCategory } from '../nft/types'

export type OrderStatus = 'open' | 'sold' | 'cancelled'

export type Order = {
  id: string
  nftId: string
  category: NFTCategory
  nftAddress: string
  owner: string
  buyer: string | null
  price: string
  status: OrderStatus
  expiresAt: string
  createdAt: string
  updatedAt: string
}
