export type SuperRareOrder = {
  asset: SuperRareAsset
  taker: SuperRareOwner | null
  maker: SuperRareOwner | null
  marketContractAddress: string
  timestamp: string
  amount: number
}

export type SuperRareAsset = {
  id: number
  contractAddress: string
  creator: SuperRareOwner
  image: string
  category: string
  likeCount: number
  url: string
  owner: SuperRareOwner
  media: string | null
  name: string
  metadataUri: string
  description: string
  viewCount: number
  tags: string[]
}

export type SuperRareOwner = {
  address: string
  user: {
    username: string
    ethereumAddress: string
    superRareUrl: string
    avatar: string | null
  }
}

import { SortDirection } from '../../routing/search'

export type SuperRareFetchNFTOptions = Partial<{
  asset_contract_addresses: string[]
  creator_addresses: string[]
  owner_addresses: string[]
  asset_ids: number[]
  categories: string[]
  name: string
  for_sale: boolean
  offset: number
  limit: number
}>

export type SuperRareFetchOrderOptions = Partial<{
  taker_addresses: string[]
  maker_addresses: string[]
  creator_addresses: string[]
  owner_addresses: string[]
  asset_contract_addresses: string[]
  asset_ids: number[]
  categories: string[]
  name: string
  order: SortDirection
  sort: 'price' | 'timestamp'
  offset: number
  limit: number
}>
