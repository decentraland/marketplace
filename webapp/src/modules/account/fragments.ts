import { gql } from 'apollo-boost'

import { nftFragment, NFTFragment } from '../nft/fragments'
import { Account } from './types'

export const accountFields = () => gql`
  fragment accountFields on Wallet {
    id
    # address
  }
`

export const accountFragment = () => gql`
  fragment accountFragment on Wallet {
    ...accountFields
    nfts {
      ...nftFragment
    }
  }
  ${accountFields()}
  ${nftFragment()}
`

export type AccountFields = Omit<Account, 'nftIds'>
export type AccountFragment = AccountFields & { nfts: NFTFragment[] }
