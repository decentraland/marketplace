import { ChainId, Network } from '@dcl/schemas'
import { OrderStatus } from '../order/types'

export type Bid = {
  id: string
  bidder: string
  seller: string
  price: string
  fingerprint: string
  status: OrderStatus
  blockchainId: string
  blockNumber: string
  expiresAt: number
  createdAt: number
  updatedAt: number
  contractAddress: string
  tokenId: string
  network: Network
  chainId: ChainId
}
