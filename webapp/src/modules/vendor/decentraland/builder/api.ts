import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { AddressesByTagResponse, BuilderCollectionAttributes } from './types'
import { config } from '../../../../config'
import { retryParams } from '../utils'

export const BUILDER_SERVER_URL = config.get('BUILDER_SERVER_URL')!

class BuilderAPI extends BaseAPI {
  fetchAddressesByTag = async (
    tags: string[]
  ): Promise<AddressesByTagResponse> => {
    return this.request(
      'get',
      `/addresses?${tags.map(tag => `tag=${tag}`).join('&')}`
    )
  }

  fetchPublishedCollectionsBySearchTerm = async ({
    searchTerm,
    limit
  }: {
    searchTerm: string
    limit: number
  }): Promise<BuilderCollectionAttributes[]> => {
    return this.request(
      'get',
      `/collections?is_published=true&status=approved&q=${searchTerm}&limit=${limit}`
    )
  }

  contentUrl(hash: string) {
    return `${this.url}/storage/contents/${hash}`
  }

  fetchItemContent = async (
    collectionAddress: string,
    itemId: string
  ): Promise<Record<string, string>> => {
    return this.request('get', `/items/${collectionAddress}/${itemId}/contents`)
  }
}

export const builderAPI = new BuilderAPI(BUILDER_SERVER_URL, retryParams)
