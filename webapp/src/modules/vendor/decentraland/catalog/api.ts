import { Item, CatalogFilters } from '@dcl/schemas'
import { BaseClient } from 'decentraland-dapps/dist/lib/BaseClient'
import { config } from '../../../../config'
import { MARKETPLACE_SERVER_URL } from '../marketplace/api'
import { retryParams } from '../utils'

export class CatalogAPI extends BaseClient {
  async get(filters: CatalogFilters = {}, options?: { v2?: boolean; headers?: Record<string, string> }): Promise<{ data: Item[] }> {
    const queryParams = this.buildItemsQueryString(filters)
    const { headers, v2 = false } = options || {}
    const marketplaceAPIURL = config.get('MARKETPLACE_SERVER_URL')
    const isUsingMarketplaceAPI = this.baseUrl.includes(marketplaceAPIURL)
    // the V2 endpoint is only available in the marketplace API
    return this.fetch(`/${v2 && isUsingMarketplaceAPI ? 'v2' : 'v1'}/catalog?${queryParams}`, {
      headers
    })
  }

  private buildItemsQueryString(filters: CatalogFilters): string {
    const queryParams = new URLSearchParams()

    if (filters.first) {
      queryParams.append('first', filters.first.toString())
    }

    if (filters.skip) {
      queryParams.append('skip', filters.skip.toString())
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

    if (filters.isOnSale !== undefined) {
      queryParams.append('isOnSale', filters.isOnSale.toString())
    }

    if (filters.search) {
      queryParams.set('search', filters.search)
    }

    if (filters.isWearableHead) {
      queryParams.append('isWearableHead', 'true')
    }

    if (filters.isWearableSmart) {
      queryParams.append('isWearableSmart', 'true')
    }

    if (filters.isWearableAccessory) {
      queryParams.append('isWearableAccessory', 'true')
    }

    if (filters.wearableCategory) {
      queryParams.append('wearableCategory', filters.wearableCategory)
    }

    if (filters.rarities) {
      for (const rarity of filters.rarities) {
        queryParams.append('rarity', rarity)
      }
    }

    if (filters.wearableGenders) {
      for (const wearableGender of filters.wearableGenders) {
        queryParams.append('wearableGender', wearableGender)
      }
    }

    if (filters.emoteCategory) {
      queryParams.append('emoteCategory', filters.emoteCategory)
    }

    if (filters.emotePlayMode) {
      for (const emotePlayMode of filters.emotePlayMode) {
        queryParams.append('emotePlayMode', emotePlayMode)
      }
    }

    // if (filters.emoteGenders) {
    //   filters.emoteGenders.forEach(emoteGender =>
    //     queryParams.append('emoteGender', emoteGender)
    //   )
    // }

    if (filters.contractAddresses) {
      filters.contractAddresses.forEach(contract => queryParams.append('contractAddress', contract))
    }

    if (filters.itemId) {
      queryParams.append('itemId', filters.itemId)
    }

    if (filters.network) {
      queryParams.append('network', filters.network)
    }

    if (filters.minPrice) {
      queryParams.append('minPrice', filters.minPrice)
    }

    if (filters.maxPrice) {
      queryParams.append('maxPrice', filters.maxPrice)
    }

    if (filters.onlyMinting) {
      queryParams.append('onlyMinting', 'true')
    }

    if (filters.onlyListing) {
      queryParams.append('onlyListing', 'true')
    }

    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy)
    }

    if (filters.sortDirection) {
      queryParams.append('sortDirection', filters.sortDirection)
    }

    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString())
    }

    if (filters.offset) {
      queryParams.append('offset', filters.offset.toString())
    }

    if (filters.ids) {
      filters.ids.forEach(id => queryParams.append('id', id))
    }

    if (filters.emoteHasGeometry) {
      queryParams.append('emoteHasGeometry', 'true')
    }

    if (filters.emoteHasSound) {
      queryParams.append('emoteHasSound', 'true')
    }

    return queryParams.toString()
  }
}

export const catalogAPI = new CatalogAPI(MARKETPLACE_SERVER_URL, {
  retries: retryParams.attempts,
  retryDelay: retryParams.delay
})
