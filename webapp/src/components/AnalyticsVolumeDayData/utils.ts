import { AnalyticsTimeframe } from '../../modules/analytics/types'

export function formatAnalyticsVolume(volume: number) {
  if (volume > 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`
  } else if (volume > 1000) {
    return `${(volume / 1000).toFixed(2)}K`
  }

  return volume.toFixed()
}

export function formatDailySales(sales: number, timeframe: AnalyticsTimeframe) {
  if (!sales) return '0'
  switch (timeframe) {
    case AnalyticsTimeframe.WEEK:
      return `${Number((sales / 7).toFixed(2))}/day`
    case AnalyticsTimeframe.MONTH:
      return `${Number(sales / 30).toFixed(2)}/day`
    default:
      return ''
  }
}
