import { Item } from '@dcl/schemas'
import { NFT_SERVER_URL } from '../nft'
import { ItemFilters } from './types'

class ItemAPI {
  fetchItems = async (filters: ItemFilters = {}) => {
    const queryParams = this.buildItemsQueryString(filters)

    const response: { data: Item[]; total: number } = await fetch(
      `${NFT_SERVER_URL}/v1/items?${queryParams}`
    ).then(resp => resp.json())

    return response
  }

  private buildItemsQueryString(filters: ItemFilters): string {
    const queryParams = new URLSearchParams()
    // if (filters.first) {
    //   queryParams.append('first', filters.first.toString())
    // }

    queryParams.append('first', '1000')

    if (filters.skip) {
      queryParams.append('skip', filters.skip.toString())
    }

    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy)
    }

    if (filters.creator) {
      queryParams.append('owner', filters.creator)
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

    if (filters.wearableCategory) {
      queryParams.append('wearableCategory', filters.wearableCategory)
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

    return queryParams.toString()
  }
}

export const itemAPI = new ItemAPI()
