import { gql } from 'apollo-boost'
import { client } from '../api'
import { OrderStatus } from '../../../order/types'
import { BidFragment, bidFragment } from './fragments'

class BidAPI {
  async fetchBySeller(seller: string) {
    const { data } = await client.query<{ bids: BidFragment[] }>({
      query: BIDS_BY_SELLER_QUERY,
      variables: {
        seller,
        expiresAt: Date.now().toString()
      }
    })

    return data.bids
  }

  async fetchByBidder(bidder: string) {
    const { data } = await client.query<{ bids: BidFragment[] }>({
      query: BIDS_BY_BIDDER_QUERY,
      variables: {
        bidder,
        expiresAt: Date.now().toString()
      }
    })

    return data.bids
  }

  async fetchByNFT(nftId: string, status: OrderStatus = OrderStatus.OPEN) {
    const { data } = await client.query<{ bids: BidFragment[] }>({
      query: BIDS_BY_NFT_QUERY,
      variables: {
        nft: nftId,
        status: status.toString(),
        expiresAt: Date.now().toString()
      }
    })

    return data.bids
  }
}

const BIDS_BY_SELLER_QUERY = gql`
  query BidsBySeller($seller: String, $expiresAt: String) {
    bids(where: { seller: $seller, status: open, expiresAt_gt: $expiresAt }) {
      ...bidFragment
    }
  }
  ${bidFragment()}
`

const BIDS_BY_BIDDER_QUERY = gql`
  query BidsByBidder($bidder: String, $expiresAt: String) {
    bids(where: { bidder: $bidder, status: open, expiresAt_gt: $expiresAt }) {
      ...bidFragment
    }
  }
  ${bidFragment()}
`

const BIDS_BY_NFT_QUERY = gql`
  query BidsByNFT($nft: String, $status: OrderStatus, $expiresAt: String) {
    bids(where: { nft: $nft, status: $status, expiresAt_gt: $expiresAt }) {
      ...bidFragment
    }
  }
  ${bidFragment()}
`

export const bidAPI = new BidAPI()
