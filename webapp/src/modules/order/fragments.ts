import { gql } from 'apollo-boost'
import { nftFields, NFTFields } from '../nft/fragments'
import { Order } from './types'

export const orderFields = () => gql`
  fragment orderFields on Order {
    id
    category
    nftAddress
    owner
    buyer
    price
    status
    expiresAt
    createdAt
    updatedAt
  }
`

export const orderFragment = () => gql`
  fragment orderFragment on Order {
    ...orderFields
    nft {
      ...nftFields
    }
  }
  ${orderFields()}
  ${nftFields()}
`

export type OrderFields = Omit<Order, 'nftId'>
export type OrderFragment = OrderFields & { nft: NFTFields }
