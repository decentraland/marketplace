import { Order, OrderFilters } from '@dcl/schemas'
import addDays from 'date-fns/addDays'
import dateFnsFormat from 'date-fns/format'
import { getIsOrderExpired } from '../../lib/orders'
import { Asset } from '../asset/types'

export const DEFAULT_EXPIRATION_IN_DAYS = 30
export const INPUT_FORMAT = 'yyyy-MM-dd'
export const getDefaultExpirationDate = (date = Date.now()): string =>
  convertDateToDateInputValue(
    addDays(new Date(date), DEFAULT_EXPIRATION_IN_DAYS)
  )

export const convertDateToDateInputValue = (date: Date): string => {
  return dateFnsFormat(date, INPUT_FORMAT)
}

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
    asset.activeOrderId in orders &&
    !getIsOrderExpired(orders[asset.activeOrderId].expiresAt)
  ) {
    return orders[asset.activeOrderId]
  }
  return null
}

export function getSubgraphOrdersQuery(filters: OrderFilters) {
  const where: string[] = []

  if (filters.owner) {
    where.push(`owner: "${filters.owner}"`)
  }

  if (filters.status) {
    where.push(`status: "${filters.status}"`)
  }

  return `query orders {
    orders(where: {${where.join(',')}}) { 
      id
      marketplaceAddress
      tokenId
      price
      owner
      status
      createdAt
      expiresAt
      updatedAt
      nftAddress
      nft {
        id
        contractAddress
        tokenId
        owner {
          id
        }
        name
        image
        parcel {
          id
          x
          y
        }
        createdAt
      }
    }
  }`
}
