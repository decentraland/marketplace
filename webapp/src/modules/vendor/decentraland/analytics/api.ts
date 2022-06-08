import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import {
  AnalyticsTimeframe,
  AnalyticsVolumeData
} from '../../../analytics/types'
import { NFT_SERVER_URL } from '../nft'

class AnalyticsAPI extends BaseAPI {
  fetchVolumeByTimeframe = async (
    timeframe: AnalyticsTimeframe
  ): Promise<{ data: AnalyticsVolumeData }> =>
    this.request('get', `/volume/${timeframe}`)
}

export const analyticsAPI = new AnalyticsAPI(NFT_SERVER_URL)
