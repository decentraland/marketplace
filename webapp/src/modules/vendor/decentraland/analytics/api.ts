import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { AnalyticsTimeframe, AnalyticsVolumeData } from '../../../analytics/types'

export class AnalyticsAPI extends BaseAPI {
  fetchVolumeByTimeframe = async (timeframe: AnalyticsTimeframe): Promise<{ data: AnalyticsVolumeData }> =>
    this.request('get', `/volume/${timeframe}`) as Promise<{ data: AnalyticsVolumeData }>
}
