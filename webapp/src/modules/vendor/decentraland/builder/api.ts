import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { AddressesByTagResponse } from './types'
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
