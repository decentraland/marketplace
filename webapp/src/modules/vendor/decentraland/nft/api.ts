import { gql } from 'apollo-boost'

import { FetchNFTsOptions } from '../../../nft/actions'
import { nftFragment, NFTFragment } from './fragments'
import { WearableGender } from '../../../nft/wearable/types'
import { contractAddresses } from '../../../contract/utils'
import { client } from '../apiClient'

class NFTAPI {
  fetch = async (options: FetchNFTsOptions) => {
    const { variables } = options
    const query = getNFTsQuery(variables)
    const countQuery = getNFTsQuery(variables, true)

    const [{ data }, { data: countData }] = await Promise.all([
      client.query<{ nfts: NFTFragment[] }>({
        query,
        variables: {
          ...variables,
          expiresAt: Date.now().toString()
        }
      }),
      client.query<{ nfts: NFTFragment[] }>({
        query: countQuery,
        variables: {
          ...variables,
          first: 1000,
          skip: 0,
          expiresAt: Date.now().toString()
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

function getNFTsQuery(
  variables: FetchNFTsOptions['variables'],
  isCount = false
) {
  let extraWhere: string[] = []

  if (variables.address) {
    extraWhere.push('owner: $address')
  }

  if (variables.category) {
    extraWhere.push('category: $category')
  }

  if (variables.wearableCategory) {
    extraWhere.push('searchWearableCategory: $wearableCategory')
  }

  if (variables.isLand) {
    extraWhere.push('searchIsLand: $isLand')
  }

  if (variables.isWearableHead) {
    extraWhere.push('searchIsWearableHead: $isWearableHead')
  }

  if (variables.isWearableAccessory) {
    extraWhere.push('searchIsWearableAccessory: $isWearableAccessory')
  }

  if (variables.onlyOnSale) {
    extraWhere.push('searchOrderStatus: open')
    extraWhere.push('searchOrderExpiresAt_gt: $expiresAt')
  }

  if (variables.wearableRarities && variables.wearableRarities.length > 0) {
    extraWhere.push(
      `searchWearableRarity_in: [${variables.wearableRarities
        .map(rarity => `"${rarity}"`)
        .join(',')}]`
    )
  }

  if (variables.wearableGenders && variables.wearableGenders.length > 0) {
    const hasMale = variables.wearableGenders.includes(WearableGender.MALE)
    const hasFemale = variables.wearableGenders.includes(WearableGender.FEMALE)

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

  if (variables.search) {
    extraWhere.push(
      `searchText_contains: "${variables.search.trim().toLowerCase()}"`
    )
  }

  if (variables.contracts && variables.contracts.length > 0) {
    extraWhere.push(
      `contractAddress_in: [${variables.contracts
        .map(contract => `"${contractAddresses[contract]}"`)
        .join(', ')}]`
    )
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
