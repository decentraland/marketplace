import { Order } from './types'
import { SortDirection, SortBy } from '../routing/search'

export function getSortOrder(sortBy: SortBy) {
  let orderBy: keyof Order = 'createdAt'
  let orderDirection: SortDirection = SortDirection.DESC
  switch (sortBy) {
    case SortBy.NEWEST: {
      orderBy = 'createdAt'
      orderDirection = SortDirection.DESC
      break
    }
    case SortBy.CHEAPEST: {
      orderBy = 'price'
      orderDirection = SortDirection.ASC
      break
    }
  }

  return [orderBy, orderDirection] as const
}

export function formatPrice(wei: string) {
  return (parseInt(wei, 10) / 10 ** 18).toLocaleString()
}
