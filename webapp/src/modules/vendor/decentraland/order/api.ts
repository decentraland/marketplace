import { Order, OrderStatus } from '../../../order/types'
import { NFT_SERVER_URL } from '../nft'

class OrderAPI {
  async fetchByNFT(
    contractAddress: string,
    tokenId: string,
    status?: OrderStatus
  ) {
    const response: { data: Order[]; total: number } = await fetch(
      `${NFT_SERVER_URL}/v1/orders?contractAddress=${contractAddress}&tokenId=${tokenId}${
        status ? `&status=${status}` : ``
      }`
    ).then(resp => resp.json())
    return response.data
  }
}

export const orderAPI = new OrderAPI()
