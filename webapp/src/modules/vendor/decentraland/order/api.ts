import { OrderFilters, OrderSortBy } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFT_SERVER_URL } from '../nft'
import { retryParams } from '../utils'
import { OrderResponse } from './types'

class OrderAPI extends BaseAPI {
  private buildOrdersQueryString(params: OrderFilters, sortBy: OrderSortBy): string {
    const queryParams = new URLSearchParams()
    params.first && queryParams.append('first', params.first.toString())
    params.skip && queryParams.append('skip', params.skip.toString())
    params.marketplaceAddress && queryParams.append('marketplaceAddress', params.marketplaceAddress.toString())
    params.owner && queryParams.append('owner', params.owner.toString())
    params.buyer && queryParams.append('buyer', params.buyer.toString())
    params.contractAddress && queryParams.append('contractAddress', params.contractAddress.toString())
    params.tokenId && queryParams.append('tokenId', params.tokenId.toString())
    params.status && queryParams.append('status', params.status.toString())
    params.network && queryParams.append('network', params.network.toString())
    params.itemId && queryParams.append('itemId', params.itemId.toString())
    params.nftName && queryParams.append('nftName', params.nftName.toString())
    sortBy && queryParams.append('sortBy', sortBy.toString())

    return queryParams.toString()
  }

  async fetchOrders(params: OrderFilters, sortBy: OrderSortBy): Promise<OrderResponse> {
    const queryParams = this.buildOrdersQueryString(params, sortBy)

    return this.request('get', `/orders?${queryParams}`)
  }
}

export const orderAPI = new OrderAPI(NFT_SERVER_URL, retryParams)
