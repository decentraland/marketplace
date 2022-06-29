import {
  RankingEntities,
  AnalyticsTimeframe,
  RankingsSortBy
} from '../../modules/analytics/types'

export const parseURLHash = (hash: string) => {
  const splitted = hash.split('-')
  return {
    entity: splitted[1] as RankingEntities,
    timeframe: splitted[2] as AnalyticsTimeframe,
    sortBy: splitted[3] as RankingsSortBy
  }
}
