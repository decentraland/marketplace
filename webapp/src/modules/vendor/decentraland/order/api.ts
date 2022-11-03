import { ListingStatus, Order } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFT_SERVER_URL } from '../nft'
import { retryParams } from '../utils';

class OrderAPI extends BaseAPI {
  async fetchByNFT(
    contractAddress: string,
    tokenId: string,
    status?: ListingStatus
  ): Promise<Order[]> {
    const response: { data: Order[]; total: number } = await this.request(
      'get',
      '/orders',
      { contractAddress, tokenId, status }
    )
    return response.data
  }
}

export const orderAPI = new OrderAPI(NFT_SERVER_URL, retryParams)
