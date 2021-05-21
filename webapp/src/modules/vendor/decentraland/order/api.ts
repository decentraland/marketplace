import { Order } from '../../../order/types'

const NFT_SERVER_URL = process.env.REACT_APP_NFT_SERVER_URL!

class OrderAPI {
  async fetchByNFT(contractAddress: string, tokenId: string) {
    const orders: Order[] = await fetch(
      `${NFT_SERVER_URL}/v1/contracts/${contractAddress}/tokens/${tokenId}/history`
    ).then(resp => resp.json())
    return orders
  }
}

export const orderAPI = new OrderAPI()
