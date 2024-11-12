import { utils } from 'ethers'
import { AnalyticsTimeframe } from '../../analytics/types'
import { TokenConverter } from '../TokenConverter'
import { AnalyticsAPI } from './analytics/api'
import { retryParams } from './utils'

export class AnalyticsService {
  private tokenConverter: TokenConverter
  private analyticsAPI: AnalyticsAPI

  constructor(serverURL: string) {
    this.tokenConverter = new TokenConverter()
    this.analyticsAPI = new AnalyticsAPI(serverURL, retryParams)
  }

  async fetchVolumeData(timeframe: AnalyticsTimeframe) {
    const { data } = await this.analyticsAPI.fetchVolumeByTimeframe(timeframe)

    return {
      sales: data.sales,
      volume: parseFloat(utils.formatEther(data.volume)),
      volumeUSD: await this.tokenConverter.marketMANAToUSD(parseFloat(utils.formatEther(data.volume))),
      creatorsEarnings: parseFloat(utils.formatEther(data.creatorsEarnings)),
      creatorsEarningsUSD: await this.tokenConverter.marketMANAToUSD(parseFloat(utils.formatEther(data.creatorsEarnings))),
      daoEarnings: parseFloat(utils.formatEther(data.daoEarnings)),
      daoEarningsUSD: await this.tokenConverter.marketMANAToUSD(parseFloat(utils.formatEther(data.daoEarnings)))
    }
  }
}
