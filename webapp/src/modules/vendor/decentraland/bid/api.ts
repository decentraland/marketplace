import { OrderStatus } from '../../../order/types'
import { Bid } from '../../../bid/types'
import { NFT_SERVER_URL } from '../nft'

class BidAPI {
  async fetch(options: Record<string, string>) {
    const queryParams = new URLSearchParams()
    for (const key of Object.keys(options)) {
      queryParams.append(key, options[key])
    }
    try {
      const bids: Bid[] = await fetch(
        `${NFT_SERVER_URL}/v1/bids?${queryParams.toString()}`
      ).then(resp => resp.json())
      return bids
    } catch (error) {
      return []
    }
  }
  async fetchBySeller(seller: string) {
    return this.fetch({ seller })
  }

  async fetchByBidder(bidder: string) {
    return this.fetch({ bidder })
  }

  async fetchByNFT(nftId: string, status: OrderStatus = OrderStatus.OPEN) {
    return this.fetch({ nftId, status })
  }
}

export const bidAPI = new BidAPI()
