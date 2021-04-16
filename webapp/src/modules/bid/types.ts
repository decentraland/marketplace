import { OrderStatus } from '../order/types'

export type Bid = {
  id: string
  bidder: string
  seller: string
  price: string
  fingerprint: 'string'
  status: OrderStatus
  blockchainId: string
  blockNumber: string
  expiresAt: string
  createdAt: string
  updatedAt: string
  contractAddress: string
  tokenId: string
}
