import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { Order, OrderStatus } from '../../../order/types'
import { NFT_SERVER_URL } from '../nft'

class OrderAPI extends BaseAPI {
  async fetchByNFT(
    contractAddress: string,
    tokenId: string,
    status?: OrderStatus
  ): Promise<Order[]> {
    const response: { data: Order[]; total: number } = await this.request(
      'get',
      '/orders',
      { contractAddress, tokenId, status }
    )
    return response.data
  }
}

export const orderAPI = new OrderAPI(NFT_SERVER_URL)
