import { ChainId, Network } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  NFT,
  NFTsFetchParams,
  NFTsCountParams,
  NFTCategory
} from '../nft/types'
import { Account } from '../account/types'
import { Bid } from '../bid/types'
import { OrderStatus, Order } from '../order/types'
import { NFTsFetchFilters } from './nft/types'
import { VendorName, TransferType } from './types'

export type Contract = {
  name: string
  address: string
  category: NFTCategory | null
  vendor: VendorName | null
  network: Network
  chainId: ChainId
}

export interface NFTService<V extends VendorName> {
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
    wallet: Wallet | null,
    toAddress: string,
    nft: NFT<V>
  ) => Promise<string>
}
export class NFTService<V> {}

export interface OrderService<V extends VendorName> {
  fetchByNFT: (nft: NFT<V>) => Promise<Order[]>
  create: (
    wallet: Wallet | null,
    nft: NFT<V>,
    price: number,
    expiresAt: number
  ) => Promise<string>
  execute: (
    wallet: Wallet | null,
    nft: NFT<V>,
    order: Order,
    fingerprint?: string
  ) => Promise<string>
  cancel: (wallet: Wallet | null, nft: NFT<V>) => Promise<string>
  canSell(): boolean
}
export class OrderService<V> {}

export interface BidService<V extends VendorName> {
  fetchBySeller: (seller: string) => Promise<Bid[]>
  fetchByBidder: (bidder: string) => Promise<Bid[]>
  fetchByNFT: (nft: NFT<V>, status?: OrderStatus) => Promise<Bid[]>
  place: (
    wallet: Wallet | null,
    nft: NFT<V>,
    price: number,
    expiresAt: number,
    fingerprint?: string
  ) => Promise<string>
  accept: (wallet: Wallet | null, bid: Bid) => Promise<string>
  cancel: (wallet: Wallet | null, bid: Bid) => Promise<string>
}
export class BidService<V> {}

export interface ContractService {
  build(): Promise<void>
  getContracts(): Contract[]
  getTransferType: (address: string) => TransferType
}
export class ContractService {}
