import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { config } from '../../../../config'

export const DCL_LISTS_URL = config.get('DCL_LISTS_SERVER', '')

export class DclListsAPI extends BaseAPI {
  public async fetchBannedNames(): Promise<string[]> {
    const response: { data: string[] } = await this.request(
      'POST',
      '/banned-names'
    )
    return response.data
  }
}

export const lists = new DclListsAPI(DCL_LISTS_URL)
