import { gql } from 'apollo-boost'
import { client } from './client'
import { bidFragment, BidFragment } from '../../modules/bid/fragments'
import { Bid } from '../../modules/bid/types'
import { getNFTName, getNFTId } from '../../modules/nft/utils'
import { NFT } from '../../modules/nft/types'
import { OrderStatus } from '../../modules/order/types'

class BidAPI {
  async fetchBySeller(seller: string) {
    const { data } = await client.query({
      query: BIDS_BY_SELLER_QUERY,
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
      query: BIDS_BY_BIDDER_QUERY,
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

  async fetchByNFT(nft: NFT, status: OrderStatus = OrderStatus.OPEN) {
    const { data } = await client.query({
      query: BIDS_BY_NFT_QUERY,
      variables: {
        nft: getNFTId(nft.contractAddress, nft.tokenId)!,
        status: status.toString(),
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

export const BIDS_BY_SELLER_QUERY = gql`
  query BidsBySeller($seller: String, $expiresAt: String) {
    bids(where: { seller: $seller, status: open, expiresAt_gt: $expiresAt }) {
      ...bidFragment
    }
  }
  ${bidFragment()}
`

export const BIDS_BY_BIDDER_QUERY = gql`
  query BidsByBidder($bidder: String, $expiresAt: String) {
    bids(where: { bidder: $bidder, status: open, expiresAt_gt: $expiresAt }) {
      ...bidFragment
    }
  }
  ${bidFragment()}
`

export const BIDS_BY_NFT_QUERY = gql`
  query BidsByNFT($nft: String, $status: OrderStatus, $expiresAt: String) {
    bids(where: { nft: $nft, status: $status, expiresAt_gt: $expiresAt }) {
      ...bidFragment
    }
  }
  ${bidFragment()}
`

export const bidAPI = new BidAPI()
