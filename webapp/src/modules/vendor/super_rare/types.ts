export type SuperRareOrder = {
  asset: SuperRareAsset
  taker: SuperRareOwner | null
  maker: SuperRareOwner | null
  marketContractAddress: string
  timestamp: string
  amount: number
  amountWithFee: number
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

export type SuperRareFetchNFTOptions = Partial<{
  type: 'sell' | 'buy'
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

export type SuperRareFetchOrderParams = Partial<{
  type: 'sell' | 'buy'
  taker_addresses: string[]
  maker_addresses: string[]
  creator_addresses: string[]
  owner_addresses: string[]
  asset_contract_addresses: string[]
  asset_ids: number[]
  categories: string[]
  name: string
  order: 'asc' | 'desc'
  sort: 'price' | 'timestamp'
  offset: number
  limit: number
}>
