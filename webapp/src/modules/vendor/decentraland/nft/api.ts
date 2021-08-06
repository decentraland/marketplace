import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFTsFetchParams } from '../../../nft/types'
import { NFTsFetchFilters, NFTResponse, NFTResult } from './types'
import { ATLAS_SERVER_URL } from '../land'
import { Contract } from '../../services'
import { contracts } from '../../../contract/utils'
import { VendorName } from '../../types'
import { getNFTSortBy } from '../../../routing/search'

export const NFT_SERVER_URL = process.env.REACT_APP_NFT_SERVER_URL!

class NFTAPI extends BaseAPI {
  fetch = async (
    params: NFTsFetchParams,
    filters?: NFTsFetchFilters
  ): Promise<NFTResponse> => {
    const queryParams = this.buildNFTQueryString(params, filters)
    return this.request('get', `/nfts?${queryParams}`)
  }

  async fetchOne(contractAddress: string, tokenId: string): Promise<NFTResult> {
    const response: NFTResponse = await this.request('get', '/nfts', {
      contractAddress,
      tokenId
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

    if (params.search) {
      queryParams.set('search', params.search)
    }
    if (filters) {
      if (filters.wearableRarities) {
        for (const wearableRarity of filters.wearableRarities) {
          queryParams.append('itemRarity', wearableRarity)
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
      if (filters.wearableCategory) {
        queryParams.append('wearableCategory', filters.wearableCategory)
      }
      if (filters.wearableGenders) {
        for (const wearableGender of filters.wearableGenders) {
          queryParams.append('wearableGender', wearableGender)
        }
      }
      if (filters.contracts) {
        for (const address of filters.contracts) {
          if (contracts.some(contract => contract.address === address)) {
            queryParams.append('contractAddress', address)
          }
        }
      }
      if (filters.network) {
        queryParams.append('network', filters.network)
      }
    }

    return queryParams.toString()
  }
}

export const nftAPI = new NFTAPI(NFT_SERVER_URL)
