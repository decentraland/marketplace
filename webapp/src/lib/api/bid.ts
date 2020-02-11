import { gql } from 'apollo-boost'
import { client } from './client'
import { bidFragment, BidFragment } from '../../modules/bid/fragments'
import { Bid } from '../../modules/bid/types'
import { getNFTName } from '../../modules/nft/utils'
import { NFT } from '../../modules/nft/types'

export const BIDS_BY_SELLER = gql`
  query BidsBySeller($seller: String, $expiresAt: String) {
    bids(where: { seller: $seller, status: open, expiresAt_gt: $expiresAt }) {
      ...bidFragment
    }
  }
  ${bidFragment()}
`

export const BIDS_BY_BIDDER = gql`
  query BidsByBidder($bidder: String, $expiresAt: String) {
    bids(where: { bidder: $bidder, status: open, expiresAt_gt: $expiresAt }) {
      ...bidFragment
    }
  }
  ${bidFragment()}
`

class BidAPI {
  async fetchBySeller(seller: string) {
    const { data } = await client.query({
      query: BIDS_BY_SELLER,
      variables: {
        seller,
        expiresAt: Date.now().toString()
      }
    })

    let bids: Bid[] = []
    for (const result of data.bids as BidFragment[]) {
      const { nft, ...rest } = result
      bids.push({
        ...rest,
        name: getNFTName(nft as NFT),
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId
      })
    }
    return bids
  }
  async fetchByBidder(bidder: string) {
    const { data } = await client.query({
      query: BIDS_BY_BIDDER,
      variables: {
        bidder,
        expiresAt: Date.now().toString()
      }
    })

    let bids: Bid[] = []
    for (const result of data.bids as BidFragment[]) {
      const { nft, ...rest } = result
      bids.push({
        ...rest,
        name: getNFTName(nft as NFT),
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId
      })
    }
    return bids
  }
}

export const bidAPI = new BidAPI()
