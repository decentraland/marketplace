import { gql } from 'apollo-boost'

import { NFTsFetchParams } from '../../../nft/types'
import { marketplaceClient } from '../api'
import { nftFragment, NFTFragment } from './fragments'
import { NFTsFetchFilters } from './types'

class NFTAPI {
  fetch = async (params: NFTsFetchParams, filters?: NFTsFetchFilters) => {
    const query = getNFTsQuery(params, filters)
    const variables = this.buildFetchVariables(params, filters)

    const { data } = await marketplaceClient.query<{ nfts: NFTFragment[] }>({
      query,
      variables
    })

    return data.nfts
  }

  async count(params: NFTsFetchParams, filters?: NFTsFetchFilters) {
    const countQuery = getNFTsCountQuery(params, filters)
    const variables = this.buildFetchVariables(params, filters)

    const { data } = await marketplaceClient.query<{ nfts: NFTFragment[] }>({
      query: countQuery,
      variables
    })

    return data.nfts.length
  }

  async fetchOne(contractAddress: string, tokenId: string) {
    const { data } = await marketplaceClient.query<{ nfts: NFTFragment[] }>({
      query: NFT_BY_ADDRESS_AND_ID_QUERY,
      variables: {
        contractAddress,
        tokenId
      }
    })
    return data.nfts[0]
  }

  async fetchTokenId(x: number, y: number) {
    const { data } = await marketplaceClient.query<{
      parcels: { tokenId: string }[]
    }>({
      query: PARCEL_TOKEN_ID_QUERY,
      variables: { x, y },
      fetchPolicy: 'cache-first'
    })
    const { tokenId } = data.parcels[0]
    return tokenId
  }

  private buildFetchVariables(
    params: NFTsFetchParams,
    filters?: NFTsFetchFilters
  ) {
    return {
      ...params,
      ...filters,
      expiresAt: Date.now().toString()
    }
  }
}

const NFTS_FILTERS = `
  $first: Int
  $skip: Int
  $orderBy: String
  $orderDirection: String

  $expiresAt: String
  $address: String
  $category: Category
  $isLand: Boolean
`

const NFTS_ARGUMENTS = `
  first: $first
  skip: $skip
  orderBy: $orderBy
  orderDirection: $orderDirection
`

function getNFTsCountQuery(
  params: NFTsFetchParams,
  filters: NFTsFetchFilters = {}
) {
  return getNFTsQuery(params, filters, true)
}

function getNFTsQuery(
  params: NFTsFetchParams,
  filters: NFTsFetchFilters = {},
  isCount = false
) {
  let extraWhere: string[] = []

  if (params.address) {
    extraWhere.push('owner: $address')
  }

  if (params.category) {
    extraWhere.push('category: $category')
  }

  if (params.onlyOnSale) {
    extraWhere.push('searchOrderStatus: open')
    extraWhere.push('searchOrderExpiresAt_gt: $expiresAt')
  }

  if (params.search) {
    extraWhere.push(
      `searchText_contains: "${params.search.trim().toLowerCase()}"`
    )
  }

  if (filters.isLand) {
    extraWhere.push('searchIsLand: $isLand')
  }

  return gql`
    query NFTs(
      ${NFTS_FILTERS}
    ) {
      nfts(
        where: {
          searchEstateSize_gt: 0
          searchParcelIsInBounds: true
          ${extraWhere.join('\n')}
        }
        ${NFTS_ARGUMENTS}
      ) {
        ${isCount ? 'id' : '...nftFragment'}
      }
    }
    ${isCount ? '' : nftFragment()}
  `
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
