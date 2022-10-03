import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { Item } from '@dcl/schemas'
import { NFT_SERVER_URL } from '../nft'
import { ItemFilters, ItemResponse } from './types'

const DEFAULT_TRENDING_PAGE_SIZE = 20

class ItemAPI extends BaseAPI {
  fetch = async (filters: ItemFilters = {}): Promise<ItemResponse> => {
    const queryParams = this.buildItemsQueryString(filters)
    return this.request('get', `/items?${queryParams}`)
  }

  fetchTrendings = async (
    size = DEFAULT_TRENDING_PAGE_SIZE
  ): Promise<ItemResponse> => {
    return this.request('get', `/trendings?size=${size}`)
  }

  fetchOne = async (contractAddress: string, itemId: string): Promise<Item> => {
    const response: ItemResponse = await this.request('get', '/items', {
      contractAddress,
      itemId
    })

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

    // TODO: remove
    // queryParams.append('first', '1000')

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
      queryParams.append('creator', filters.creator)
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
    if (filters.contractAddress) {
      queryParams.append('contractAddress', filters.contractAddress)
    }
    if (filters.itemId) {
      queryParams.append('itemId', filters.itemId)
    }
    if (filters.network) {
      queryParams.append('network', filters.network)
    }

    if (filters.emotePlayMode) {
      queryParams.append('emotePlayMode', filters.emotePlayMode)
    }

    return queryParams.toString()
  }
}

export const itemAPI = new ItemAPI(NFT_SERVER_URL)
