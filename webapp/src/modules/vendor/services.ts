import { NFT, NFTsFetchParams, NFTsCountParams } from '../nft/types'
import { Account } from '../account/types'
import { Bid } from '../bid/types'
import { OrderStatus, Order } from '../order/types'
import { NFTsFetchFilters, NFTCategory } from './nft/types'
import { TransferType } from './types'

export interface NFTService {
  fetch: (
    params: NFTsFetchParams,
    filters?: NFTsFetchFilters
  ) => Promise<readonly [NFT[], Account[], Order[], number]>
  count: (
    params: NFTsCountParams,
    filters?: NFTsFetchFilters
  ) => Promise<number>
  fetchOne: (
    contractAddress: string,
    tokenId: string
  ) => Promise<readonly [NFT, Order | undefined]>
  transfer: (
    fromAddress: string,
    toAddress: string,
    nft: NFT
  ) => Promise<string>
}
export class NFTService {}

export interface OrderService {
  fetchByNFT: (nft: NFT) => Promise<Order[]>
  create: (
    nft: NFT,
    price: number,
    expiresAt: number,
    fromAddress: string
  ) => Promise<string>
  execute: (
    nft: NFT,
    order: Order,
    fromAddress: string,
    fingerprint?: string
  ) => Promise<string>
  cancel: (nft: NFT, fromAddress: string) => Promise<string>
  canSell(): boolean
}
export class OrderService {}

export interface BidService {
  fetchBySeller: (seller: string) => Promise<Bid[]>
  fetchByBidder: (bidder: string) => Promise<Bid[]>
  fetchByNFT: (nft: NFT, status?: OrderStatus) => Promise<Bid[]>
  place: (
    nft: NFT,
    price: number,
    expiresAt: number,
    fromAddress: string,
    fingerprint?: string
  ) => Promise<string>
  accept: (bid: Bid, fromAddress: string) => Promise<string>
  cancel: (bid: Bid, fromAddress: string) => Promise<string>
}
export class BidService {}

export interface ContractService {
  contractAddresses: Record<string, string>
  contractSymbols: Record<string, string>
  contractNames: Record<string, string>
  contractCategories: Record<string, NFTCategory>
  getTransferType: (address: string) => TransferType
}
export class ContractService {}
