import { gql } from 'apollo-boost'

import { NFT } from '../../../nft/types'
import { orderFields, OrderFields } from '../order/fragments'

export const nftFields = () => gql`
  fragment nftFields on NFT {
    id
    name
    image
    contractAddress
    tokenId
    category
    owner {
      address
    }
    parcel {
      x
      y
      data {
        description
      }
    }
    estate {
      size
      parcels(first: 1000) {
        x
        y
      }
      data {
        description
      }
    }
    wearable {
      description
      category
      rarity
      bodyShapes
    }
    ens {
      subdomain
    }
  }
`

export const nftFragment = () => gql`
  fragment nftFragment on NFT {
    ...nftFields
    activeOrder(size_gt: 0) {
      ...orderFields
    }
  }
  ${nftFields()}
  ${orderFields()}
`

export type NFTFields = Omit<NFT, 'activeOrderId'>
export type NFTFragment = Omit<NFTFields, 'vendor'> & {
  activeOrder: OrderFields | null
}
