import { BidSortBy, TradeAssetType, TradeChecks } from '@dcl/schemas'

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

export type ContractTradeAsset = {
  assetType: TradeAssetType
  contractAddress: string
  value: string
  extra: string
  beneficiary: string
}

export type ContractTrade = {
  signer: string
  signature: string
  checks: TradeChecks & { allowedProof: string[] }
  sent: ContractTradeAsset[]
  received: ContractTradeAsset[]
}
