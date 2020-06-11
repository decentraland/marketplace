import { NFT } from '../nft/types'
import { Account } from '../account/types'
import { Bid } from '../bid/types'
import { OrderStatus, Order } from '../order/types'
import { FetchNFTsOptions } from './types'

export interface NFTService {
  fetch: (
    options: FetchNFTsOptions
  ) => Promise<readonly [NFT[], Account[], Order[], number]>
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
  fetchByNFT: (nftId: string) => Promise<Order[]>
  create: (
    nft: NFT,
    price: number,
    expiresAt: number,
    fromAddress: string
  ) => Promise<string>
  execute: (
    nft: NFT,
    price: string,
    fromAddress: string,
    fingerprint?: string
  ) => Promise<string>
  cancel: (nft: NFT, fromAddress: string) => Promise<string>
}
export class OrderService {}

export interface BidService {
  fetchBySeller: (seller: string) => Promise<Bid[]>
  fetchByBidder: (bidder: string) => Promise<Bid[]>
  fetchByNFT: (nftId: string, status?: OrderStatus) => Promise<Bid[]>
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
