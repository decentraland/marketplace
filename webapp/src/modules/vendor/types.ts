import { SortDirection } from '../routing/search'
import { NFTSortBy, NFTCategory, NFT } from '../nft/types'
import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from '../nft/wearable/types'
import { ContractName } from '../contract/types'
import { Account } from '../account/types'
import { Bid } from '../bid/types'
import { OrderStatus, Order } from '../order/types'
import { View } from '../ui/types'

export enum Vendors {
  DECENTRALAND = 'decentraland',
  SUPERRARE = 'superrare'
}

export type FetchNFTsOptions = {
  variables: {
    first: number
    skip: number
    orderBy?: NFTSortBy
    orderDirection?: SortDirection
    address?: string
    onlyOnSale: boolean
    isLand?: boolean
    isWearableHead?: boolean
    isWearableAccessory?: boolean
    category?: NFTCategory
    wearableCategory?: WearableCategory
    wearableRarities?: WearableRarity[]
    wearableGenders?: WearableGender[]
    search?: string
    contracts?: ContractName[]
  }
  view?: View
}

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
    price: number,
    fromAddress: string,
    fingerprint?: string
  ) => Promise<string>
  cancel: (nft: NFT, fromAddress: string) => Promise<string>
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
