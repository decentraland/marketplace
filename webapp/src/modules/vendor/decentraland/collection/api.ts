import { Collection, CollectionFilters } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFT_SERVER_URL } from '../nft'
import { retryParams } from '../utils'
import { CollectionResponse } from './types'

class CollectionAPI extends BaseAPI {
  fetch = async (filters: CollectionFilters = {}): Promise<CollectionResponse> => {
    const queryParams = this.buildCollectionsQueryString(filters)
    return this.request('get', `/collections?${queryParams}`)
  }

  fetchOne = async (collectionUrn: string): Promise<Collection> => {
    const { data }: CollectionResponse = await this.request('get', '/collections', {
      urn: collectionUrn
    })

    if (data.length === 0) {
      throw new Error('Not found')
    }

    return data[0]
  }

  private buildCollectionsQueryString(filters: CollectionFilters): string {
    const queryParams = new URLSearchParams()

    if (filters.first) {
      queryParams.append('first', filters.first.toString())
    }

    if (filters.skip) {
      queryParams.append('skip', filters.skip.toString())
    }

    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy)
    }

    if (filters.search) {
      queryParams.set('search', filters.search)
    }

    if (filters.creator) {
      queryParams.append('creator', filters.creator)
    }

    if (filters.isOnSale) {
      queryParams.append('isOnSale', 'true')
    }

    if (filters.contractAddress) {
      queryParams.append('contractAddress', filters.contractAddress)
    }

    if (filters.network) {
      queryParams.append('network', filters.network)
    }

    return queryParams.toString()
  }
}

export const collectionAPI = new CollectionAPI(NFT_SERVER_URL, retryParams)
