import { Bid, Network, Order, Sale, Trade } from '@dcl/schemas'

export enum ActivityEventType {
  SALE_BUYER = 'sale_buyer',
  SALE_SELLER = 'sale_seller',
  BID_PLACED = 'bid_placed',
  BID_RECEIVED = 'bid_received',
  ORDER_CREATED = 'order_created',
  ORDER_FILLED = 'order_filled',
  TRADE_CREATED = 'trade_created'
}

export type ActivityEventBase = {
  id: string
  timestamp: number
  network: Network
  txHash?: string
  contractAddress?: string
  tokenId?: string
  itemId?: string
  price?: string
  counterparty?: string
}

export type SaleBuyerEvent = ActivityEventBase & { type: ActivityEventType.SALE_BUYER; details: { sale: Sale } }
export type SaleSellerEvent = ActivityEventBase & { type: ActivityEventType.SALE_SELLER; details: { sale: Sale } }
export type BidPlacedEvent = ActivityEventBase & { type: ActivityEventType.BID_PLACED; details: { bid: Bid } }
export type BidReceivedEvent = ActivityEventBase & { type: ActivityEventType.BID_RECEIVED; details: { bid: Bid } }
export type OrderCreatedEvent = ActivityEventBase & { type: ActivityEventType.ORDER_CREATED; details: { order: Order } }
export type OrderFilledEvent = ActivityEventBase & { type: ActivityEventType.ORDER_FILLED; details: { order: Order } }
export type TradeCreatedEvent = ActivityEventBase & { type: ActivityEventType.TRADE_CREATED; details: { trade: Trade } }

export type ActivityEvent =
  | SaleBuyerEvent
  | SaleSellerEvent
  | BidPlacedEvent
  | BidReceivedEvent
  | OrderCreatedEvent
  | OrderFilledEvent
  | TradeCreatedEvent
