import { BaseClient } from 'decentraland-dapps/dist/lib/BaseClient'
import { config } from '../../../../config'
import { FavoritedItemIds } from '../../../favorites/types'
import { ItemFilters } from '../item/types'

export const DEFAULT_FAVORITES_LIST_ID = config.get(
  'DEFAULT_FAVORITES_LIST_ID'
)!

export const MARKETPLACE_FAVORITES_SERVER_URL = config.get(
  'MARKETPLACE_FAVORITES_SERVER_URL'
)!

export class FavoritesAPI extends BaseClient {
  async getWhoFavoritedAnItem(
    itemId: string,
    limit: number,
    offset: number
  ): Promise<{ addresses: string[]; total: number }> {
    const { results, total } = await this.fetch<{
      results: { userAddress: string }[]
      total: number
    }>(`/v1/picks/${itemId}?limit=${limit}&offset=${offset}`)

    return {
      addresses: results.map(pick => pick.userAddress),
      total
    }
  }

  async pickItemAsFavorite(itemId: string): Promise<void> {
    return this.fetch(`/v1/lists/${DEFAULT_FAVORITES_LIST_ID}/picks`, {
      method: 'POST',
      body: JSON.stringify({ itemId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async unpickItemAsFavorite(itemId: string): Promise<void> {
    return this.fetch(
      `/v1/lists/${DEFAULT_FAVORITES_LIST_ID}/picks/${itemId}`,
      {
        method: 'DELETE'
      }
    )
  }

  async getPicksByList(
    listId: string,
    filters: ItemFilters = {}
  ): Promise<{
    results: FavoritedItemIds
    total: number
  }> {
    const queryParams = new URLSearchParams()

    if (filters.first) {
      queryParams.append('limit', filters.first.toString())
    }

    if (filters.skip) {
      queryParams.append('offset', filters.skip.toString())
    }

    return this.fetch(
      `/v1/lists/${listId}/picks` +
        (queryParams.toString() && `?${queryParams.toString()}`)
    )
  }
}
