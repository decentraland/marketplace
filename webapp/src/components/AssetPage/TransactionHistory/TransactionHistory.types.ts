import { Bid } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'
import { Order } from '../../../modules/order/types'

export type Props = {
  nft: NFT | null
}

export type HistoryEvent = {
  from: string
  to: string
  price: string
  updatedAt: number
}

export type UnionOrderBid = Partial<Order & Bid>

export type MapStateProps = {}
export type MapDispatchProps = {}
