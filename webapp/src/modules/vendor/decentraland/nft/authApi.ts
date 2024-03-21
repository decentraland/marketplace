import { NFTCategory, NFTFilters, RentalStatus } from '@dcl/schemas'
import { BaseClient } from 'decentraland-dapps/dist/lib/BaseClient'
import { NFTsFetchParams } from '../../../nft/types'
import { NFTsFetchFilters, NFTResponse, NFTResult, OwnersFilters, OwnersResponse } from './types'
import { ATLAS_SERVER_URL } from '../land'
import { FetchOneOptions } from '../../types'
import { getNFTSortBy } from '../../../routing/search'
import { AssetType } from '../../../asset/types'
import { config } from '../../../../config'

export const NFT_SERVER_URL = config.get('NFT_SERVER_URL')

export enum PriceFilterExtraOption {
  LAND = 'land'
}

export type PriceFilterOptions = NFTCategory | PriceFilterExtraOption
export type PriceFilters = Omit<NFTsFetchFilters, 'category'> & {
  category: NFTCategory | PriceFilterExtraOption
  assetType?: AssetType
}

export type EstateSizeFilters = Pick<
  NFTFilters,
  'isOnSale' | 'adjacentToRoad' | 'minDistanceToPlaza' | 'maxDistanceToPlaza' | 'minPrice' | 'maxPrice'
>

export class NFTAuthAPI extends BaseClient {
  async get(params: NFTsFetchParams, filters?: NFTsFetchFilters): Promise<NFTResponse> {
    const queryParams = this.buildNFTQueryString(params, filters)
    return this.fetch(`/v1/nfts?${queryParams}`)
  }

  async fetchOne(contractAddress: string, tokenId: string, options?: FetchOneOptions): Promise<NFTResult> {
    const queryParams = new URLSearchParams()
    queryParams.append('contractAddress', contractAddress)
    queryParams.append('tokenId', tokenId)
    if (options) {
      Object.entries(options).forEach(([key, value]) =>
        Array.isArray(value) ? value.forEach(aValue => queryParams.append(key, aValue)) : queryParams.append(key, value)
      )
    }
    const response: NFTResponse = await this.fetch(`/v1/nfts?${queryParams.toString()}`)

    if (response.data.length === 0) {
      throw new Error('Not found')
    }

    return response.data[0]
  }

  async fetchTokenId(x: number, y: number) {
    try {
      const { id } = await fetch(`${ATLAS_SERVER_URL}/v2/parcels/${x}/${y}`).then(resp => resp.json())
      return id as string
    } catch (error) {
      return null
    }
  }

  private appendNFTFiltersToQueryParams(queryParams: URLSearchParams, filters: NFTsFetchFilters): void {
    if (filters.rarities) {
      for (const rarity of filters.rarities) {
        queryParams.append('itemRarity', rarity)
      }
    }
    if (filters.isLand) {
      queryParams.append('isLand', 'true')
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
    if (filters.network) {
      queryParams.append('network', filters.network)
    }

    if (filters.emotePlayMode) {
      for (const emotePlayMode of filters.emotePlayMode) {
        queryParams.append('emotePlayMode', emotePlayMode)
      }
    }

    if (filters.tenant) {
      queryParams.append('tenant', filters.tenant)
    }

    if (filters.rentalStatus) {
      const statuses: RentalStatus[] = !Array.isArray(filters.rentalStatus) ? [filters.rentalStatus] : filters.rentalStatus
      statuses.forEach(status => queryParams.append('rentalStatus', status))
    }

    if (filters.creator) {
      const creators = Array.isArray(filters.creator) ? filters.creator : [filters.creator]
      creators.forEach(creator => queryParams.append('creator', creator))
    }

    if (filters.contracts && filters.contracts.length > 0) {
      for (const contract of filters.contracts) {
        queryParams.append('contractAddress', contract)
      }
    }
    if (filters.minPrice) {
      queryParams.append('minPrice', filters.minPrice)
    }

    if (filters.maxPrice) {
      queryParams.append('maxPrice', filters.maxPrice)
    }
    if (filters.minEstateSize) {
      queryParams.append('minEstateSize', filters.minEstateSize)
    }

    if (filters.maxEstateSize) {
      queryParams.append('maxEstateSize', filters.maxEstateSize)
    }

    if (filters.minDistanceToPlaza) {
      queryParams.append('minDistanceToPlaza', filters.minDistanceToPlaza)
    }

    if (filters.maxDistanceToPlaza) {
      queryParams.append('maxDistanceToPlaza', filters.maxDistanceToPlaza)
    }

    if (filters.adjacentToRoad) {
      queryParams.append('adjacentToRoad', 'true')
    }

    if (filters.rentalDays) {
      for (const rentalDay of filters.rentalDays) {
        queryParams.append('rentalDays', rentalDay.toString())
      }
    }
  }

  private buildNFTQueryString(params: NFTsFetchParams, filters?: NFTsFetchFilters): string {
    const queryParams = new URLSearchParams()
    queryParams.append('first', params.first.toString())
    queryParams.append('skip', params.skip.toString())
    if (params.orderBy) {
      queryParams.append('sortBy', getNFTSortBy(params.orderBy))
    }
    if (params.category) {
      queryParams.append('category', params.category)
    }
    if (params.address) {
      queryParams.append('owner', params.address)
    }
    if (params.onlyOnSale) {
      queryParams.append('isOnSale', 'true')
    }
    if (params.onlyOnRent) {
      queryParams.append('isOnRent', 'true')
    }
    if (params.search) {
      queryParams.set('search', params.search)
    }
    if (filters) {
      this.appendNFTFiltersToQueryParams(queryParams, filters)
    }

    return queryParams.toString()
  }

  async getOwners(params: OwnersFilters): Promise<{ data: OwnersResponse[]; total: number }> {
    const queryParams = this.buildGetOwnersParams(params)
    return this.fetch(`/v1/owners?${queryParams}`)
  }

  private buildGetOwnersParams(filters: OwnersFilters): string {
    const queryParams = new URLSearchParams()

    const entries = Object.entries(filters)

    for (const [key, value] of entries) {
      queryParams.append(key, value.toString())
    }

    return queryParams.toString()
  }
}
