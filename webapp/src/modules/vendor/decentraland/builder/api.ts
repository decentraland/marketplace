import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { AddressesByTagResponse } from './types'
import { config } from '../../../../config'

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
}

export const builderAPI = new BuilderAPI(BUILDER_SERVER_URL)
