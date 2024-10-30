import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { AnalyticsTimeframe, AnalyticsVolumeData } from '../../../analytics/types'
import { MARKETPLACE_SERVER_URL } from '../marketplace/api'
import { retryParams } from '../utils'

class AnalyticsAPI extends BaseAPI {
  fetchVolumeByTimeframe = async (timeframe: AnalyticsTimeframe): Promise<{ data: AnalyticsVolumeData }> =>
    this.request('get', `/volume/${timeframe}`) as Promise<{ data: AnalyticsVolumeData }>
}

export const analyticsAPI = new AnalyticsAPI(MARKETPLACE_SERVER_URL, retryParams)
