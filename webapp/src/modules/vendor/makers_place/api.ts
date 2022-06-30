import { AxiosRequestConfig } from 'axios'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { SortDirection } from '../../routing/types'
import { capitalize } from '../../../lib/text'
import { NFTsFetchParams, NFTSortBy } from '../../nft/types'
import {
  Response,
  FetchSuccessResponse,
  FetchOneSuccessResponse,
  MakersPlaceFetchParams,
  MakersPlaceFetchOneParams,
  MakersPlaceSort
} from './types'
import { config } from '../../../config'

const API_URL = config.get('MAKERS_PLACE_API_URL')!

export const MAX_QUERY_SIZE = 50

class MakersPlaceAPI extends BaseAPI {
  constructor(url: string) {
    super(url)

    if (!url) {
      throw new Error(`Invalid MakersPlace API URL "${url}"`)
    }
  }

  async fetch(params: NFTsFetchParams): Promise<FetchSuccessResponse> {
    const skip = params.skip || 0
    const page_size = Math.min(params.first, MAX_QUERY_SIZE)
    const page_num = Math.ceil(skip / page_size) + 1

    const requestParams: MakersPlaceFetchParams = {
      page_num,
      page_size,
      on_sale: 'True',
      owner_address: params.address,
      q: params.search,
      sort: this.getSort(params)
    }
    return this.request('get', '/assets/', requestParams)
  }

  async fetchOne(
    contractAddress: string,
    tokenId: string
  ): Promise<FetchOneSuccessResponse> {
    const requestParams: MakersPlaceFetchOneParams = {
      token_id: Number(tokenId),
      contract_address: contractAddress
    }
    return this.request('get', '/asset/', requestParams)
  }

  async request<T extends Response>(
    method: AxiosRequestConfig['method'],
    path: string,
    params: MakersPlaceFetchParams | MakersPlaceFetchOneParams
  ) {
    const response: Response = await super.request(method, path, params)

    if (response.status === 'failure') {
      const errors = JSON.stringify(response.errors, null, 2)
      throw new Error(`Error fetching MakersPlace path "${path}": ${errors}`)
    }

    return response as T
  }

  private getSort(params: NFTsFetchParams) {
    let sort
    switch (params.orderBy) {
      case NFTSortBy.PRICE:
        sort = 'price'
        break
      case NFTSortBy.ORDER_CREATED_AT:
      default:
        sort = 'createdAt'
        break
    }

    const direction = params.orderDirection || SortDirection.DESC
    return (sort + capitalize(direction)) as MakersPlaceSort
  }
}

export const makersPlaceAPI = new MakersPlaceAPI(API_URL)
