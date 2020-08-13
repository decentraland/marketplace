import {
  NFT,
  NFTCategory,
  NFTsFetchParams,
  NFTsCountParams
} from '../nft/types'
import { Account } from '../account/types'
import { Bid } from '../bid/types'
import { OrderStatus, Order } from '../order/types'
import { NFTsFetchFilters } from './nft/types'
import { Vendors, TransferType } from './types'

export interface NFTService<V extends Vendors> {
  fetch: (
    params: NFTsFetchParams,
    filters?: NFTsFetchFilters<V>
  ) => Promise<readonly [NFT<V>[], Account[], Order[], number]>
  count: (
    params: NFTsCountParams,
    filters?: NFTsFetchFilters<V>
  ) => Promise<number>
  fetchOne: (
    contractAddress: string,
    tokenId: string
  ) => Promise<readonly [NFT<V>, Order | undefined]>
  transfer: (
    fromAddress: string,
    toAddress: string,
    nft: NFT<V>
  ) => Promise<string>
}
export class NFTService<V> {}

export interface OrderService<V extends Vendors> {
  fetchByNFT: (nft: NFT<V>) => Promise<Order[]>
  create: (
    nft: NFT<V>,
    price: number,
    expiresAt: number,
    fromAddress: string
  ) => Promise<string>
  execute: (
    nft: NFT<V>,
    order: Order,
    fromAddress: string,
    fingerprint?: string
  ) => Promise<string>
  cancel: (nft: NFT<V>, fromAddress: string) => Promise<string>
  canSell(): boolean
}
export class OrderService<V> {}

export interface BidService<V extends Vendors> {
  fetchBySeller: (seller: string) => Promise<Bid[]>
  fetchByBidder: (bidder: string) => Promise<Bid[]>
  fetchByNFT: (nft: NFT<V>, status?: OrderStatus) => Promise<Bid[]>
  place: (
    nft: NFT<V>,
    price: number,
    expiresAt: number,
    fromAddress: string,
    fingerprint?: string
  ) => Promise<string>
  accept: (bid: Bid, fromAddress: string) => Promise<string>
  cancel: (bid: Bid, fromAddress: string) => Promise<string>
}
export class BidService<V> {}

export interface ContractService {
  contractAddresses: Record<string, string>
  contractSymbols: Record<string, string>
  contractNames: Record<string, string>
  contractCategories: Record<string, NFTCategory>
  getTransferType: (address: string) => TransferType
}
export class ContractService {}
