import { Bid, BidSortBy, ListingStatus } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFT_SERVER_URL } from '../nft'
import { retryParams } from '../utils'

const FIRST = '1000'

class BidAPI extends BaseAPI {
  async fetch(
    options: Record<string, string>,
    sortBy?: BidSortBy
  ): Promise<Bid[]> {
    const queryParams = new URLSearchParams()
    for (const key of Object.keys(options)) {
      queryParams.append(key, options[key])
    }
    sortBy && queryParams.append('sortBy', sortBy.toString())
    try {
      const response: { data: Bid[]; total: number } = await this.request(
        'get',
        `/bids?${queryParams.toString()}`
      )
      return response.data
    } catch (error) {
      return []
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
    status: ListingStatus = ListingStatus.OPEN,
    sortBy?: BidSortBy,
    first: string = FIRST
  ) {
    return this.fetch(
      {
        contractAddress,
        tokenId,
        status,
        first
      },
      sortBy
    )
  }
}

export const bidAPI = new BidAPI(NFT_SERVER_URL, retryParams)
