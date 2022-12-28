import { RentalStatus } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFTsFetchParams } from '../../../nft/types'
import { NFTsFetchFilters, NFTResponse, NFTResult } from './types'
import { ATLAS_SERVER_URL } from '../land'
import { Contract } from '../../services'
import { FetchOneOptions, VendorName } from '../../types'
import { getNFTSortBy } from '../../../routing/search'
import { config } from '../../../../config'
import { retryParams } from '../utils'

export const NFT_SERVER_URL = config.get('NFT_SERVER_URL')!

class NFTAPI extends BaseAPI {
  fetch = async (
    params: NFTsFetchParams,
    filters?: NFTsFetchFilters
  ): Promise<NFTResponse> => {
    const queryParams = this.buildNFTQueryString(params, filters)
    return this.request('get', `/nfts?${queryParams}`)
  }

  async fetchOne(
    contractAddress: string,
    tokenId: string,
    options?: FetchOneOptions
  ): Promise<NFTResult> {
    const response: NFTResponse = await this.request('get', '/nfts', {
      contractAddress,
      tokenId,
      ...options
    })

    if (response.data.length === 0) {
      throw new Error('Not found')
    }

    return response.data[0]
  }

  async fetchTokenId(x: number, y: number) {
    try {
      const { id } = await fetch(
        `${ATLAS_SERVER_URL}/v2/parcels/${x}/${y}`
      ).then(resp => resp.json())
      return id
    } catch (error) {
      return null
    }
  }

  async fetchContracts(): Promise<Contract[]> {
    try {
      const response: {
        data: Omit<Contract, 'vendor'>[]
        total: number
      } = await this.request('get', '/contracts', { first: 0 })
      const contracts: Contract[] = response.data.map(
        contractWithoutVendor => ({
          ...contractWithoutVendor,
          vendor: VendorName.DECENTRALAND
        })
      )
      return contracts
    } catch (error) {
      return []
    }
  }

  private buildNFTQueryString(
    params: NFTsFetchParams,
    filters?: NFTsFetchFilters
  ): string {
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
        queryParams.append('emotePlayMode', filters.emotePlayMode)
      }

      if (filters.rentalStatus) {
        const statuses: RentalStatus[] = !Array.isArray(filters.rentalStatus)
          ? [filters.rentalStatus]
          : filters.rentalStatus
        statuses.forEach(status => queryParams.append('rentalStatus', status))
      }
    }

    return queryParams.toString()
  }
}

export const nftAPI = new NFTAPI(NFT_SERVER_URL, retryParams)
