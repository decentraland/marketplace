import axios from 'axios'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { config } from '../../../../config'
import { retryParams } from '../utils'

export const ATLAS_SERVER_URL = config.get('ATLAS_SERVER_URL')!
const httpRequest = axios.create({ baseURL: ATLAS_SERVER_URL })
class AtlasAPI extends BaseAPI {
  fetchLastUpdatedDate = async (): Promise<Date> => {
    const result: any = await this.request('get', `/v2/tiles/info`)
    return new Date(result.lastUpdatedAt)
  }

  fetchTiles = async (): Promise<any> => httpRequest.get('/v1/tiles')
}

export const atlasAPI = new AtlasAPI(ATLAS_SERVER_URL, retryParams)
