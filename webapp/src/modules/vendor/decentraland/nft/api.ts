import { gql } from 'apollo-boost'

import { NFTsFetchParams } from '../../../nft/types'
import { WearableGender } from '../../../nft/wearable/types'
import { contractAddresses } from '../../../contract/utils'
import { client } from '../apiClient'
import { nftFragment, NFTFragment } from './fragments'
import { NFTsFetchFilters } from './types'

class NFTAPI {
  fetch = async (params: NFTsFetchParams) => {
    const query = getNFTsQuery(params)
    const countQuery = getNFTsCountQuery(params)

    const expiresAt = Date.now().toString()

    const [{ data }, { data: countData }] = await Promise.all([
      client.query<{ nfts: NFTFragment[] }>({
        query,
        variables: {
          ...params,
          ...params.filters,
          expiresAt
        }
      }),
      client.query<{ nfts: NFTFragment[] }>({
        query: countQuery,
        variables: {
          ...params,
          ...params.filters,
          first: 1000,
          skip: 0,
          expiresAt
        }
      })
    ])

    return {
      nfts: data.nfts,
      total: countData.nfts.length
    }
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
}

const NFTS_FILTERS = `
  $first: Int
  $skip: Int
  $orderBy: String
  $orderDirection: String

  $expiresAt: String
  $address: String
  $category: Category
  $wearableCategory: WearableCategory
  $isLand: Boolean
  $isWearableHead: Boolean
  $isWearableAccessory: Boolean
`

const NFTS_ARGUMENTS = `
  first: $first
  skip: $skip
  orderBy: $orderBy
  orderDirection: $orderDirection
`

function getNFTsCountQuery(params: NFTsFetchParams) {
  return getNFTsQuery(params, true)
}

function getNFTsQuery(params: NFTsFetchParams, isCount = false) {
  const filters = (params.filters || {}) as NFTsFetchFilters
  let extraWhere: string[] = []

  console.log('*********************************************')
  console.log(filters, params)
  console.log('*********************************************')

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

  if (filters.wearableCategory) {
    extraWhere.push('searchWearableCategory: $wearableCategory')
  }

  if (filters.isLand) {
    extraWhere.push('searchIsLand: $isLand')
  }

  if (filters.isWearableHead) {
    extraWhere.push('searchIsWearableHead: $isWearableHead')
  }

  if (filters.isWearableAccessory) {
    extraWhere.push('searchIsWearableAccessory: $isWearableAccessory')
  }

  if (filters.wearableRarities && filters.wearableRarities.length > 0) {
    extraWhere.push(
      `searchWearableRarity_in: [${filters.wearableRarities
        .map(rarity => `"${rarity}"`)
        .join(',')}]`
    )
  }

  if (filters.wearableGenders && filters.wearableGenders.length > 0) {
    const hasMale = filters.wearableGenders.includes(WearableGender.MALE)
    const hasFemale = filters.wearableGenders.includes(WearableGender.FEMALE)

    if (hasMale && !hasFemale) {
      extraWhere.push(`searchWearableBodyShapes: [BaseMale]`)
    } else if (hasFemale && !hasMale) {
      extraWhere.push(`searchWearableBodyShapes: [BaseFemale]`)
    } else if (hasMale && hasFemale) {
      extraWhere.push(
        `searchWearableBodyShapes_contains: [BaseMale, BaseFemale]`
      )
    }
  }

  if (filters.contracts && filters.contracts.length > 0) {
    extraWhere.push(
      `contractAddress_in: [${filters.contracts
        .map(contract => `"${contractAddresses[contract]}"`)
        .join(', ')}]`
    )
  }

  console.log(`
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

    `)

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
