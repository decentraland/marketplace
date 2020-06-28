import { AxiosRequestConfig } from 'axios'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFTsFetchParams, NFTSortBy } from '../../nft/types'
import {
  SuperRareOrder,
  SuperRareAsset,
  SuperRareFetchNFTOptions,
  SuperRareFetchOrderParams
} from './types'

export const SUPER_RARE_API_URL = 'https://superrare.co/sr-json/v0'

class SuperRareAPI extends BaseAPI {
  public API_KEY: string = ''

  constructor(url: string) {
    super(url)

    this.API_KEY = process.env.REACT_APP_SUPER_RARE_API_KEY!

    if (!this.API_KEY) {
      throw new Error(`Invalid superRare API KEY "${this.API_KEY}"`)
    }
  }

  async fetchNFT(
    contractAddress: string,
    tokenId: string
  ): Promise<SuperRareAsset> {
    const requestParams: SuperRareFetchNFTOptions = {
      asset_contract_addresses: [contractAddress],
      asset_ids: [Number(tokenId)]
    }
    const nfts: SuperRareAsset[] = await this.request(
      'get',
      '/nfts/assets',
      requestParams
    )
    return nfts[0]
  }

  async fetchOrder(
    contractAddress: string,
    tokenId: string
  ): Promise<SuperRareOrder> {
    const requestParams: SuperRareFetchOrderParams = {
      asset_contract_addresses: [contractAddress],
      asset_ids: [Number(tokenId)]
    }
    const orders: SuperRareOrder[] = await this.request(
      'get',
      '/nfts/orders',
      requestParams
    )
    return orders[0]
  }

  fetchOrders(params: NFTsFetchParams): Promise<SuperRareOrder[]> {
    const orderBy =
      params.orderBy === NFTSortBy.PRICE
        ? 'price'
        : params.orderBy === NFTSortBy.ORDER_CREATED_AT
        ? 'timestamp'
        : undefined

    const requestParams: SuperRareFetchOrderParams = {
      sort: orderBy,
      name: params.search,
      order: params.orderDirection,
      offset: params.skip,
      limit: params.first
    }

    return this.request('get', '/nfts/orders', requestParams)
  }

  request(
    method: AxiosRequestConfig['method'],
    path: string,
    params: SuperRareFetchOrderParams
  ) {
    return super.request(
      method,
      path,
      { ...params, type: 'sell' },
      this.getHeaders()
    )
  }

  private getHeaders() {
    return {
      headers: { Authorization: `Bearer ${this.API_KEY}` }
    }
  }
}

export const superRareAPI = new SuperRareAPI(SUPER_RARE_API_URL)
