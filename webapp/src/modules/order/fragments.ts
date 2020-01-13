import { gql } from 'apollo-boost'

import { nftFields } from '../nft/fragments'

export const orderFields = gql`
  fragment orderFields on Order {
    nft {
      ...nftFields
    }
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
  ${nftFields}
`
