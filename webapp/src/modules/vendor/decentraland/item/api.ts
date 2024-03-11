import { Item } from '@dcl/schemas'
import { BaseClient } from 'decentraland-dapps/dist/lib/BaseClient'
import { ItemFilters, ItemResponse } from './types'

export const DEFAULT_TRENDING_PAGE_SIZE = 20

export class ItemAPI extends BaseClient {
  async get(filters: ItemFilters = {}): Promise<ItemResponse> {
    const queryParams = this.buildItemsQueryString(filters)
    return this.fetch(`/v1/items?${queryParams}`)
  }

  async getTrendings(size = DEFAULT_TRENDING_PAGE_SIZE): Promise<ItemResponse> {
    return this.fetch(`/v1/trendings?size=${size}`)
  }

  async getOne(contractAddress: string, itemId: string): Promise<Item> {
    const queryParams = this.buildItemsQueryString({
      contractAddresses: [contractAddress],
      itemId
    })
    const response: ItemResponse = await this.fetch(`/v1/items?${queryParams.toString()}`)

    if (response.data.length === 0) {
      throw new Error('Not found')
    }

    return response.data[0]
  }

  private buildItemsQueryString(filters: ItemFilters): string {
    const queryParams = new URLSearchParams()

    if (filters.first) {
      queryParams.append('first', filters.first.toString())
    }

    if (filters.skip) {
      queryParams.append('skip', filters.skip.toString())
    }

    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy)
    }

    if (filters.category) {
      queryParams.append('category', filters.category)
    }

    if (filters.creator) {
      const creators = Array.isArray(filters.creator) ? filters.creator : [filters.creator]
      creators.forEach(creator => queryParams.append('creator', creator))
    }

    if (filters.isSoldOut) {
      queryParams.append('isSoldOut', 'true')
    }

    if (filters.isOnSale) {
      queryParams.append('isOnSale', 'true')
    }

    if (filters.search) {
      queryParams.set('search', filters.search)
    }

    if (filters.rarities) {
      for (const rarity of filters.rarities) {
        queryParams.append('rarity', rarity)
      }
    }
    if (filters.isWearableHead) {
      queryParams.append('isWearableHead', 'true')
    }

    if (filters.isWearableAccessory) {
      queryParams.append('isWearableAccessory', 'true')
    }

    if (filters.isWearableSmart) {
      queryParams.append('isWearableSmart', 'true')
    }

    if (filters.wearableCategory) {
      queryParams.append('wearableCategory', filters.wearableCategory)
    }

    if (filters.emoteCategory) {
      queryParams.append('emoteCategory', filters.emoteCategory)
    }

    if (filters.wearableGenders) {
      for (const wearableGender of filters.wearableGenders) {
        queryParams.append('wearableGender', wearableGender)
      }
    }
    if (filters.ids) {
      filters.ids.forEach(id => queryParams.append('id', id))
    }
    if (filters.contractAddresses) {
      filters.contractAddresses.forEach(contract => queryParams.append('contractAddress', contract))
    }
    if (filters.itemId) {
      queryParams.append('itemId', filters.itemId)
    }
    if (filters.network) {
      queryParams.append('network', filters.network)
    }

    if (filters.emotePlayMode) {
      for (const emotePlayMode of filters.emotePlayMode) {
        queryParams.append('emotePlayMode', emotePlayMode)
      }
    }

    if (filters.minPrice) {
      queryParams.append('minPrice', filters.minPrice)
    }

    if (filters.maxPrice) {
      queryParams.append('maxPrice', filters.maxPrice)
    }

    return queryParams.toString()
  }
}
