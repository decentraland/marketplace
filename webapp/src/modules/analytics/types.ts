import {
  AnalyticsDayData,
  Account,
  Item,
  Rarity,
  WearableCategory
} from '@dcl/schemas'

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

export enum RankingsTimeframes {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all'
}

export enum RankingEntities {
  ITEMS = 'items',
  CREATORS = 'creators',
  COLLECTORS = 'collectors'
}

export enum RankingsSortBy {
  MOST_VOLUME = 'most_volume',
  MOST_SALES = 'most_sales'
}

export type RankingsFilters = {
  from?: number
  rarity?: Rarity
  category?: WearableCategory
  sortBy?: RankingsSortBy
}

export type ItemRank = Pick<Item, 'id'> & {
  sales: number
  volume: string
}
export type CreatorRank = Pick<Account, 'id'> & {
  sales: number
  earned: string
  collections: number
  uniqueCollectors: number
}
export type CollectorRank = Pick<Account, 'id'> & {
  purchases: number
  spent: string
  uniqueAndMythicItems: number
  creatorsSupported: number
}

export type RankingEntity = ItemRank | CreatorRank | CollectorRank
