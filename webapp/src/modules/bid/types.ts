import { NFTCategory } from '../nft/types'
import { OrderStatus } from '../order/types'

export type Bid = {
  id: string
  category: NFTCategory
  bidder: string
  seller: string
  price: string
  fingerprint: 'string'
  status: OrderStatus
  blockNumber: string
  expiresAt: string
  createdAt: string
  updatedAt: string
  contractAddress: string
  tokenId: string
  name: string
}
