import { gql } from 'apollo-boost'

import { nftFields, NFTFields } from '../nft/fragments'
import { Order } from './types'

export type OrderFields = Omit<Order, 'nftId'>
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

export type OrderFragment = OrderFields & { nft: NFTFields }
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
