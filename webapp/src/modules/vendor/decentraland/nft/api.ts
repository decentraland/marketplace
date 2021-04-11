import { gql } from 'apollo-boost'

import { NFTsFetchParams } from '../../../nft/types'
import { client } from '../api'
import { nftFragment, NFTFragment } from './fragments'
import { NFTsFetchFilters, NFTsFetchResponse } from './types'
import { getSortBy } from '../../../nft/utils'
import { contractAddresses } from '../../../contract/utils'

class NFTAPI {
  fetch = async (params: NFTsFetchParams, filters?: NFTsFetchFilters) => {
    const queryParams = this.buildQueryString(params, filters)

    const response: NFTsFetchResponse = await fetch(
      `http://localhost:5000/v1/browse?${queryParams}`
    ).then(resp => resp.json())

    return response
  }

  async fetchOne(contractAddress: string, tokenId: string) {
    const { data } = await client.query<{ nfts: NFTFragment[] }>({
      query: NFT_BY_ADDRESS_AND_ID_QUERY,
      variables: {
        contractAddress,
        tokenId
      }
    })
    return data.nfts[0]
  }

  async fetchTokenId(x: number, y: number) {
    const { data } = await client.query<{ parcels: { tokenId: string }[] }>({
      query: PARCEL_TOKEN_ID_QUERY,
      variables: { x, y },
      fetchPolicy: 'cache-first'
    })
    const { tokenId } = data.parcels[0]
    return tokenId
  }

  private buildQueryString(
    params: NFTsFetchParams,
    filters?: NFTsFetchFilters
  ): string {
    const queryParams = new URLSearchParams()
    queryParams.append('first', params.first.toString())
    queryParams.append('skip', params.skip.toString())
    if (params.orderBy) {
      queryParams.append('sortBy', getSortBy(params.orderBy))
    }
    if (params.category) {
      queryParams.append('category', params.category)
    }
    if (params.address) {
      queryParams.append('address', params.address)
    }
    if (params.onlyOnSale) {
      queryParams.append('isOnSale', 'true')
    }

    if (params.search) {
      queryParams.set('search', params.search)
    }
    if (filters) {
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
      if (filters.wearableRarities) {
        for (const wearableRarity of filters.wearableRarities) {
          queryParams.append('wearableRarity', wearableRarity)
        }
      }
      if (filters.wearableGenders) {
        for (const wearableGender of filters.wearableGenders) {
          queryParams.append('wearableGender', wearableGender)
        }
      }
      if (filters.contracts) {
        for (const contract of filters.contracts) {
          if (contract in contractAddresses) {
            const address = contractAddresses[contract]
            queryParams.append('contracts', address)
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

const NFT_BY_ADDRESS_AND_ID_QUERY = gql`
  query NFTByTokenId($contractAddress: String, $tokenId: String) {
    nfts(
      where: { contractAddress: $contractAddress, tokenId: $tokenId }
      first: 1
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

const PARCEL_TOKEN_ID_QUERY = gql`
  query ParcelTokenId($x: BigInt, $y: BigInt) {
    parcels(where: { x: $x, y: $y }) {
      tokenId
    }
  }
`

export const nftAPI = new NFTAPI()
