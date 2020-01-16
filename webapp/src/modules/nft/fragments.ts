import { gql } from 'apollo-boost'

import { orderFields, OrderFields } from '../order/fragments'
import { NFT } from './types'

export const nftFields = () => gql`
  fragment nftFields on NFT {
    id
    name
    image
    tokenId
    category
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
export type NFTFragment = NFTFields & { activeOrder: OrderFields }
