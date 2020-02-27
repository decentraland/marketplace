import addDays from 'date-fns/addDays'
import dateFnsFormat from 'date-fns/format'
import { NFT } from '../nft/types'
import { Order } from './types'
import { formatDistanceToNow } from '../../lib/date'

export const DEFAULT_EXPIRATION_IN_DAYS = 30
export const INPUT_FORMAT = 'yyyy-MM-dd'
export const getDefaultExpirationDate = (date = Date.now()) =>
  dateFnsFormat(
    addDays(new Date(date), DEFAULT_EXPIRATION_IN_DAYS),
    INPUT_FORMAT
  )

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
