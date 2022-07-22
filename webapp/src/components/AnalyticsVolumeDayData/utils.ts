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
      return `${Math.round(sales / 7)}/day`
    case AnalyticsTimeframe.MONTH:
      return `${Math.round(sales / 30)}/day`
    default:
      return ''
  }
}
