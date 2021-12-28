import { Order } from '@dcl/schemas'
import addDays from 'date-fns/addDays'
import dateFnsFormat from 'date-fns/format'
import { Asset } from '../asset/types'

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

export function getActiveOrder(
  asset: Asset | null,
  orders: Record<string, Order>
) {
  if (
    asset &&
    'activeOrderId' in asset &&
    !!asset.activeOrderId &&
    asset.activeOrderId in orders
  ) {
    return orders[asset.activeOrderId]
  }
  return null
}
