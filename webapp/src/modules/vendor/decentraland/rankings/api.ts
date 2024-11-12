import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { AnalyticsTimeframe, RankingEntities, RankingEntity, RankingsFilters } from '../../../analytics/types'

const DEFAULT_REQUEST_SIZE = 5

export class RankingsAPI extends BaseAPI {
  fetch = async (entity: RankingEntities, timeframe: AnalyticsTimeframe, filters: RankingsFilters = {}): Promise<RankingEntity> => {
    const queryParams = this.buildItemsQueryString(filters)
    return this.request('get', `/rankings/${entity}/${timeframe}?${queryParams}`) as Promise<RankingEntity>
  }

  private buildItemsQueryString(filters: RankingsFilters & { first?: string }): string {
    const queryParams = new URLSearchParams()

    if (filters.category) {
      queryParams.append('category', filters.category)
    }
    if (filters.rarity) {
      queryParams.append('rarity', filters.rarity)
    }
    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy.toString())
    }

    queryParams.append('first', filters.first ? filters.first : DEFAULT_REQUEST_SIZE.toString())

    return queryParams.toString()
  }
}
