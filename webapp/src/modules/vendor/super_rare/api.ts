import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFTSortBy } from '../../nft/types'
import { FetchNFTsOptions } from '../types'
import {
  SuperRareOrder,
  SuperRareAsset,
  SuperRareFetchNFTOptions,
  SuperRareFetchOrderOptions
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
    const requestOptions: SuperRareFetchNFTOptions = {
      asset_contract_addresses: [contractAddress],
      asset_ids: [Number(tokenId)]
    }
    const nfts: SuperRareAsset[] = await this.request(
      'get',
      '/nfts/assets',
      requestOptions,
      this.getHeaders()
    )
    return nfts[0]
  }

  async fetchOrder(
    contractAddress: string,
    tokenId: string
  ): Promise<SuperRareOrder> {
    const requestOptions: SuperRareFetchOrderOptions = {
      asset_contract_addresses: [contractAddress],
      asset_ids: [Number(tokenId)]
    }
    const orders: SuperRareOrder[] = await this.request(
      'get',
      '/nfts/orders',
      requestOptions,
      this.getHeaders()
    )
    return orders[0]
  }

  fetchOrders(options: FetchNFTsOptions): Promise<SuperRareOrder[]> {
    const { variables } = options

    const orderBy =
      variables.orderBy === NFTSortBy.PRICE
        ? 'price'
        : variables.orderBy === NFTSortBy.ORDER_CREATED_AT
        ? 'timestamp'
        : undefined

    const requestOptions: SuperRareFetchOrderOptions = {
      sort: orderBy,
      order: variables.orderDirection,
      offset: variables.skip,
      limit: variables.first
    }

    return this.request(
      'get',
      '/nfts/orders',
      requestOptions,
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
