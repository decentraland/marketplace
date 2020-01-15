import { gql } from 'apollo-boost'

import { nftFields } from '../nft/fragments'

export const accountFields = gql`
  fragment accountFields on Wallet {
    id
    nfts {
      ...nftFields
    }
  }
  ${nftFields}
`
