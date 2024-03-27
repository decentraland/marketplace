import { Bid, BidSortBy, ListingStatus } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFT_SERVER_URL } from '../nft'
import { retryParams } from '../utils'

const FIRST = '1000'

class BidAPI extends BaseAPI {
  async fetch(options: Record<string, string>, sortBy?: BidSortBy, bidder?: string): Promise<{ data: Bid[]; total: number }> {
    const queryParams = new URLSearchParams()
    for (const key of Object.keys(options)) {
      queryParams.append(key, options[key])
    }
    sortBy && queryParams.append('sortBy', sortBy.toString())
    bidder && queryParams.append('bidder', bidder)
    try {
      const response = (await this.request('get', `/bids?${queryParams.toString()}`)) as { data: Bid[]; total: number }
      return response
    } catch (error) {
      return { data: [], total: 0 }
    }
  }
  async fetchBySeller(seller: string) {
    return this.fetch({
      seller,
      status: ListingStatus.OPEN,
      first: FIRST
    })
  }

  async fetchByBidder(bidder: string) {
    return this.fetch({ bidder, status: ListingStatus.OPEN, first: FIRST })
  }

  async fetchByNFT(
    contractAddress: string,
    tokenId: string,
    status?: ListingStatus | null,
    sortBy?: BidSortBy,
    first: string = FIRST,
    skip: string = '0',
    bidder?: string
  ) {
    return this.fetch(
      {
        contractAddress,
        tokenId,
        status: status || ListingStatus.OPEN,
        first,
        skip
      },
      sortBy,
      bidder
    )
  }
}

export const bidAPI = new BidAPI(NFT_SERVER_URL, retryParams)
