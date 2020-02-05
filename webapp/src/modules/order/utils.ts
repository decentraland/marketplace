import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { NFT } from '../nft/types'
import { Order } from './types'

export const DEFAULT_EXPIRATION_IN_DAYS = 30

export function isExpired(expiresAt: string) {
  return parseInt(expiresAt, 10) < Date.now()
}

export function getActiveOrder(nft: NFT | null, orders: Record<string, Order>) {
  if (!!nft && !!nft.activeOrderId && nft.activeOrderId in orders) {
    return orders[nft.activeOrderId]
  }
  return null
}

export function getExpiresAt(order: Order) {
  return formatDistanceToNow(+order.expiresAt, { addSuffix: true })
}
