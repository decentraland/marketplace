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
