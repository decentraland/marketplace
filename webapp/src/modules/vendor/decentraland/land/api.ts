import axios from 'axios'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { config } from '../../../../config'
import { retryParams } from '../utils'

export const ATLAS_SERVER_URL = config.get('ATLAS_SERVER_URL')!
const httpRequest = axios.create({ baseURL: ATLAS_SERVER_URL })
class AtlasAPI extends BaseAPI {
  fetchTiles = async (): Promise<any> => httpRequest.get('/v1/tiles')
}

export const atlasAPI = new AtlasAPI(ATLAS_SERVER_URL, retryParams)
