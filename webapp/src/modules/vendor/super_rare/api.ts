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
    return this.request(
      'get',
      '/nfts/assets',
      this.buildFetchManyParams(params)
    )
  }

  async fetchOrders(params: NFTsFetchParams): Promise<SuperRareOrder[]> {
    return this.request(
      'get',
      '/nfts/orders',
      this.buildFetchManyParams(params)
    )
  }

  async fetchNFT(
    contractAddress: string,
    tokenId: string
  ): Promise<SuperRareAsset> {
    const nfts: SuperRareAsset[] = await this.request(
      'get',
      '/nfts/assets',
      this.buildFetchOneParams(contractAddress, tokenId)
    )
    return nfts[0]
  }

  async fetchOrder(
    contractAddress: string,
    tokenId: string
  ): Promise<SuperRareOrder> {
    const orders: SuperRareOrder[] = await this.request(
      'get',
      '/nfts/orders',
      this.buildFetchOneParams(contractAddress, tokenId)
    )
    return orders[0]
  }

  request(
    method: AxiosRequestConfig['method'],
    path: string,
    params: SuperRareFetchOrderParams
  ) {
    return super.request(method, path, params, this.getHeaders())
  }

  private getHeaders() {
    return {
      headers: { Authorization: `Bearer ${this.API_KEY}` }
    }
  }

  private buildFetchOneParams(
    contractAddress: string,
    tokenId: string
  ): SuperRareFetchNFTOptions {
    return {
      asset_contract_addresses: [contractAddress],
      asset_ids: [Number(tokenId)]
    }
  }

  private buildFetchManyParams(
    params: NFTsFetchParams
  ): SuperRareFetchOrderParams {
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

    if (params.onlyOnSale) {
      requestParams.type = 'sell'
    }

    return requestParams
  }
}

export const superRareAPI = new SuperRareAPI(API_URL)
