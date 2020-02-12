import { gql } from 'apollo-boost'
import { nftFields, NFTFields } from '../nft/fragments'
import { Bid } from './types'

export const bidFields = () => gql`
  fragment bidFields on Bid {
    id
    category
    bidder
    seller
    price
    fingerprint
    status
    blockNumber
    expiresAt
    createdAt
    updatedAt
  }
`

export const bidFragment = () => gql`
  fragment bidFragment on Bid {
    ...bidFields
    nft {
      ...nftFields
    }
  }
  ${bidFields()}
  ${nftFields()}
`

export type BidFields = Omit<Bid, 'name' | 'contractAddress' | 'tokenId'>
export type BidFragment = BidFields & { nft: NFTFields }
