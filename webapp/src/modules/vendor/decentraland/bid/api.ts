import { OrderStatus } from '../../../order/types'
import { Bid } from '../../../bid/types'
import { NFT_SERVER_URL } from '../nft'
import { NFT } from '../../../nft/types'

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
    return this.fetch({ seller, status: OrderStatus.OPEN })
  }

  async fetchByBidder(bidder: string) {
    return this.fetch({ bidder, status: OrderStatus.OPEN })
  }

  async fetchByNFT(nft: NFT, status: OrderStatus = OrderStatus.OPEN) {
    // TODO: we have to use the legacy id (still present in the marketplace subgraph) because it's the only property in the Bid schema that allows us to query by contractAddress+tokenId
    const nftId = nft.category + '-' + nft.contractAddress + '-' + nft.tokenId
    return this.fetch({ nftId, status })
  }
}

export const bidAPI = new BidAPI()
