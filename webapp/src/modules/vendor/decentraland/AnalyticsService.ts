import { utils } from 'ethers'
import { AnalyticsTimeframe } from '../../analytics/types'
import { AnalyticsService as AnalyticsServiceInterface } from '../services'
import { TokenConverter } from '../TokenConverter'
import { analyticsAPI } from './analytics/api'

export class AnalyticsService implements AnalyticsServiceInterface {
  private tokenConverter: TokenConverter
  constructor() {
    this.tokenConverter = new TokenConverter()
  }

  async fetchVolumeData(timeframe: AnalyticsTimeframe) {
    const { data } = await analyticsAPI.fetchVolumeByTimeframe(timeframe)

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
