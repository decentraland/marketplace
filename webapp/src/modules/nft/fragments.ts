import { gql } from 'apollo-boost'

import { orderFields, OrderFields } from '../order/fragments'
import { NFT } from './types'

export const nftFields = () => gql`
  fragment nftFields on NFT {
    id
    name
    image
    contractAddress
    tokenId
    category
    owner {
      id
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
  }
`

export const nftFragment = () => gql`
  fragment nftFragment on NFT {
    ...nftFields
    activeOrder {
      ...orderFields
    }
  }
  ${nftFields()}
  ${orderFields()}
`

export type NFTFields = Omit<NFT, 'activeOrderId'>
export type NFTFragment = NFTFields & { activeOrder: OrderFields | null }
