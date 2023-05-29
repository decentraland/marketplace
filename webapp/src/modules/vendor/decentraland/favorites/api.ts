import { BaseClient } from 'decentraland-dapps/dist/lib/BaseClient'
import { config } from '../../../../config'
import { isAPIError } from '../../../../lib/error'
import { FavoritedItems, List } from '../../../favorites/types'
import { ListsOptions, PicksOptions } from './types'

export const DEFAULT_FAVORITES_LIST_ID = config.get(
  'DEFAULT_FAVORITES_LIST_ID'
)!

export const MARKETPLACE_FAVORITES_SERVER_URL = config.get(
  'MARKETPLACE_FAVORITES_SERVER_URL'
)!

const ALREADY_PICKED_STATUS_CODE = 422

export class FavoritesAPI extends BaseClient {
  private buildURLWithParameters(
    endpoint: string,
    _options: ListsOptions | PicksOptions
  ) {
    const queryParams = new URLSearchParams()
    if (options.first !== undefined) {
      queryParams.append('limit', options.first.toString())
    }

    if (options.skip !== undefined) {
      queryParams.append('offset', options.skip.toString())
    }

    return endpoint + (queryParams.toString() && `?${queryParams.toString()}`)
  }

  async getWhoFavoritedAnItem(
    itemId: string,
    limit: number,
    offset: number
  ): Promise<{ addresses: string[]; total: number }> {
    const { results, total } = await this.fetch<{
      results: { userAddress: string }[]
      total: number
    }>(
      this.buildURLWithParameters(`/v1/picks/${itemId}`, {
        first: limit,
        skip: offset
      })
    )

    return {
      addresses: results.map(pick => pick.userAddress),
      total
    }
  }

  async pickItemAsFavorite(itemId: string): Promise<void> {
    try {
      await this.fetch(`/v1/lists/${DEFAULT_FAVORITES_LIST_ID}/picks`, {
        method: 'POST',
        body: JSON.stringify({ itemId }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      if (isAPIError(error) && error.status === ALREADY_PICKED_STATUS_CODE)
        return

      throw error
    }
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
    filters: PicksOptions = {}
  ): Promise<{
    results: FavoritedItems
    total: number
  }> {
    return this.fetch(
      this.buildURLWithParameters(`/v1/lists/${listId}/picks`, {
        first: filters.first,
        skip: filters.skip
      })
    )
  }

  async getLists(
    filters: ListsOptions = {}
  ): Promise<{ results: List[]; total: number }> {
    console.log('Filters', filters)
    return this.fetch(this.buildURLWithParameters('/v1/lists', filters))
  }

  async deleteList(listId: string): Promise<void> {
    return this.fetch(`/v1/lists/${listId}`, { method: 'DELETE' })
  }

  async getList(listId: string): Promise<List> {
    return this.fetch(`/v1/lists/${listId}`)
  }

  async updateList(
    listId: string,
    updatedList: Partial<List>
  ): Promise<Partial<List>> {
    return this.fetch(`/v1/lists/${listId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedList),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async createList({
    name,
    isPrivate,
    description
  }: {
    name: string
    isPrivate: boolean
    description?: string
  }): Promise<List> {
    return this.fetch('/v1/lists/', {
      method: 'POST',
      body: JSON.stringify({ name, private: isPrivate, description }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
