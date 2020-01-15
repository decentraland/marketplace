import { gql } from 'apollo-boost'
import { NFT } from './types'
import { orderFields, OrderFields } from '../order/fragments'

export type NFTFields = Omit<NFT, 'activeOrderId'>
export const nftFields = () => gql`
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
export type NFTFragment = NFTFields & { activeOrder: OrderFields }
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
