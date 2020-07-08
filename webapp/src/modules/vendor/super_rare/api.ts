import { AxiosRequestConfig } from 'axios'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFTsFetchParams, NFTSortBy } from '../../nft/types'
import {
  SuperRareOrder,
  SuperRareAsset,
  SuperRareFetchNFTOptions,
  SuperRareFetchOrderParams
} from './types'

const API_URL = process.env.REACT_APP_SUPER_RARE_API_URL!

export const MAX_QUERY_SIZE = 100

class SuperRareAPI extends BaseAPI {
  public API_KEY: string = ''

  constructor(url: string) {
    super(url)

    if (!url) {
      throw new Error(`Invalid SuperRare API URL "${url}"`)
    }

    this.API_KEY = process.env.REACT_APP_SUPER_RARE_API_KEY!
    if (!this.API_KEY) {
      throw new Error(`Invalid SuperRare API KEY "${this.API_KEY}"`)
    }
  }

  async fetchNFTs(params: NFTsFetchParams): Promise<SuperRareAsset[]> {
    const requestParams: SuperRareFetchOrderParams = {
      name: params.search,
      order: params.orderDirection,
      offset: params.skip,
      limit: params.first
    }

    requestParams.sort =
      params.orderBy === NFTSortBy.PRICE
        ? 'price'
        : params.orderBy === NFTSortBy.ORDER_CREATED_AT
        ? 'timestamp'
        : undefined

    if (params.address) {
      requestParams.owner_addresses = [params.address]
    }

    return this.request('get', '/nfts/assets', requestParams)
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

  async fetchOrders(params: NFTsFetchParams): Promise<SuperRareOrder[]> {
    const requestParams: SuperRareFetchOrderParams = {
      name: params.search,
      order: params.orderDirection,
      offset: params.skip,
      limit: params.first
    }

    requestParams.sort =
      params.orderBy === NFTSortBy.PRICE
        ? 'price'
        : params.orderBy === NFTSortBy.ORDER_CREATED_AT
        ? 'timestamp'
        : undefined

    if (params.address) {
      requestParams.owner_addresses = [params.address]
    }

    return this.request('get', '/nfts/orders', requestParams)
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

export const superRareAPI = new SuperRareAPI(API_URL)
