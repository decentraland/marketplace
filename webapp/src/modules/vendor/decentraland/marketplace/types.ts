import { BalanceItem } from '@covalenthq/client-sdk'
import { BidSortBy } from '@dcl/schemas'

export type Balance = Omit<BalanceItem, 'balance' | 'balance_24h'> & {
  balance: string | null
  balance_24h: string | null
}

export type GetBidsParameters = {
  limit?: number
  offset?: number
  bidder?: string
  seller?: string
  sortBy?: BidSortBy
}

export type PaginatedResponse<T> = {
  results: T[]
  total: number
  page: number
  pages: number
  limit: number
}
