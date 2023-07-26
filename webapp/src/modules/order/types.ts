export type LegacyOrderFragment = {
  id: string
  marketplaceAddress: string
  tokenId: string
  price: string
  status: string
  owner: string
  createdAt: string
  expiresAt: string
  updatedAt: string
  nftAddress: string
  nft: {
    id: string
    contractAddress: string
    tokenId: string
    owner: {
      id: string
    }
    name: string
    image: string
    parcel: {
      id: string
      x: string
      y: string
    }
    createdAt: string
  }
}
