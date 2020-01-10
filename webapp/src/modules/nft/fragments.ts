import { gql } from 'apollo-boost'

export const nftFields = gql`
  fragment nftFields on NFT {
    id
    name
    image
    tokenId
    parcel {
      x
      y
    }
    estate {
      size
    }
    wearable {
      description
      category
      rarity
    }
  }
`
