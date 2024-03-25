import { Bid, Contract as BaseContract, ListingStatus, NFTCategory, Order, OrderFilters, OrderSortBy, RentalListing } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Account } from '../account/types'
import { AnalyticsTimeframe, AnalyticsVolumeData } from '../analytics/types'
import { NFT, NFTsFetchParams, NFTsCountParams } from '../nft/types'
import { OrderResponse } from './decentraland/order/types'
import { NFTsFetchFilters } from './nft/types'
import { VendorName, TransferType, FetchOneOptions } from './types'

export type Contract = Omit<BaseContract, 'category'> & {
  label?: string
  category: NFTCategory | 'art' | null
  vendor: VendorName | null
}

export interface AnalyticsService {
  fetchVolumeData: (timeframe: AnalyticsTimeframe) => Promise<AnalyticsVolumeData>
}

export interface NFTService<V extends VendorName> {
  fetch: (
    params: NFTsFetchParams,
    filters?: NFTsFetchFilters<V>
  ) => Promise<readonly [NFT<V>[], Account[], Order[], RentalListing[], number]>
  count: (params: NFTsCountParams, filters?: NFTsFetchFilters<V>) => Promise<number>
  fetchOne: (
    contractAddress: string,
    tokenId: string,
    options?: FetchOneOptions
  ) => Promise<readonly [NFT<V>, Order | null, RentalListing | null]>
  transfer: (wallet: Wallet | null, toAddress: string, nft: NFT<V>) => Promise<string>
}
export interface OrderService<V extends VendorName> {
  fetchOrders: (params: OrderFilters, sortBy: OrderSortBy) => Promise<OrderResponse>
  create: (wallet: Wallet | null, nft: NFT<V>, price: number, expiresAt: number) => Promise<string>
  execute: (wallet: Wallet | null, nft: NFT<V>, order: Order, fingerprint?: string) => Promise<string>
  cancel: (wallet: Wallet | null, order: Order) => Promise<string>
  canSell(): boolean
}
export interface BidService<V extends VendorName> {
  fetchBySeller: (seller: string) => Promise<Bid[]>
  fetchByBidder: (bidder: string) => Promise<Bid[]>
  fetchByNFT: (nft: NFT<V>, status?: ListingStatus) => Promise<Bid[]>
  place: (wallet: Wallet | null, nft: NFT<V>, price: number, expiresAt: number, fingerprint?: string) => Promise<string>
  accept: (wallet: Wallet | null, bid: Bid) => Promise<string>
  cancel: (wallet: Wallet | null, bid: Bid) => Promise<string>
}

export interface ContractService {
  getContracts(): Promise<Contract[]>
  getTransferType: (address: string) => TransferType
}
