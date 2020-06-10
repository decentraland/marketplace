import { NFT } from '../../../modules/nft/types'
import { Bid } from '../../../modules/bid/types'
import { Order } from '../../../modules/order/types'

export type Props = {
  nft: NFT | null
}

export type HistoryEvent = {
  from: string
  to: string
  price: string
  updatedAt: string
}

export type UnionOrderBid = Partial<Order & Bid>

export type MapStateProps = {}
export type MapDispatchProps = {}
