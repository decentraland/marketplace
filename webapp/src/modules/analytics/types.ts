import { AnalyticsDayData } from '@dcl/schemas'

export type AnalyticsVolumeData = Pick<AnalyticsDayData, 'sales'> & {
  volume: number
  volumeUSD: number
  creatorsEarnings: number
  creatorsEarningsUSD: number
  daoEarnings: number
  daoEarningsUSD: number
}

export enum AnalyticsTimeframe {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all'
}
