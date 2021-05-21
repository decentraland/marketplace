import { Order } from '../../../order/types'
import { NFT_SERVER_URL } from '../nft'

class OrderAPI {
  async fetchByNFT(contractAddress: string, tokenId: string) {
    const orders: Order[] = await fetch(
      `${NFT_SERVER_URL}/v1/contracts/${contractAddress}/tokens/${tokenId}/history`
    ).then(resp => resp.json())
    return orders
  }
}

export const orderAPI = new OrderAPI()
