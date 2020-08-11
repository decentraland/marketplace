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
      type: 'sell',
      asset_contract_addresses: [contractAddress],
      asset_ids: [Number(tokenId)]
    }
  }

  private buildFetchManyParams(
    params: NFTsFetchParams
  ): SuperRareFetchOrderParams {
    const requestParams: SuperRareFetchOrderParams = {
      type: 'sell',
      offset: params.skip,
      limit: Math.min(params.first, MAX_QUERY_SIZE),
      sort: this.getSort(params.orderBy),
      name: params.search,
      order: params.orderDirection
    }

    if (params.address) {
      requestParams.owner_addresses = [params.address]
    }

    return requestParams
  }

  private getSort(sortBy?: NFTSortBy) {
    switch (sortBy) {
      case NFTSortBy.PRICE:
        return 'price'
      case NFTSortBy.ORDER_CREATED_AT:
        return 'timestamp'
      default:
        return undefined
    }
  }
}

export const superRareAPI = new SuperRareAPI(API_URL)
