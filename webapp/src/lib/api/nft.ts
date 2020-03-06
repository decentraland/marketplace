import { gql } from 'apollo-boost'

import { NFT } from '../../modules/nft/types'
import { Account } from '../../modules/account/types'
import { Order } from '../../modules/order/types'
import { isExpired } from '../../modules/order/utils'
import { FetchNFTsOptions } from '../../modules/nft/actions'
import { nftFragment, NFTFragment } from '../../modules/nft/fragments'
import { orderFragment } from '../../modules/order/fragments'
import { WearableGender } from '../../modules/nft/wearable/types'
import { contractAddresses } from '../../modules/contract/utils'
import { client } from './client'

class NFTAPI {
  fetch = async (options: FetchNFTsOptions) => {
    const { variables } = options
    const query = getNFTsQuery(variables)
    const countQuery = getNFTsQuery(variables, true)

    const [{ data }, { data: countData }] = await Promise.all([
      client.query({
        query,
        variables: {
          ...variables,
          expiresAt: Date.now().toString()
        }
      }),
      client.query({
        query: countQuery,
        variables: {
          ...variables,
          first: 1000,
          skip: 0,
          expiresAt: Date.now().toString()
        }
      })
    ])

    const nfts: NFT[] = []
    const accounts: Account[] = []
    const orders: Order[] = []

    for (const result of data.nfts as NFTFragment[]) {
      const { activeOrder: nestedOrder, ...rest } = result

      const nft: NFT = { ...rest, activeOrderId: null }

      if (nestedOrder && !isExpired(nestedOrder.expiresAt)) {
        const order = { ...nestedOrder, nftId: nft.id }
        nft.activeOrderId = order.id
        orders.push(order)
      }

      const address = nft.owner.address.toLowerCase()
      const account = accounts.find(account => account.id === address)
      if (account) {
        account.nftIds.push(nft.id)
      } else {
        accounts.push({ id: address, address, nftIds: [nft.id] })
      }

      nfts.push(nft)
    }

    return [nfts, accounts, orders, countData.nfts.length] as const
  }

  async fetchOne(contractAddress: string, tokenId: string) {
    const { data } = await client.query({
      query: NFT_BY_ADDRESS_AND_ID_QUERY,
      variables: {
        contractAddress,
        tokenId
      }
    })

    const { activeOrder, ...rest } = data.nfts[0] as NFTFragment

    const nft: NFT = { ...rest, activeOrderId: null }

    let order: Order | null = null

    if (activeOrder && !isExpired(activeOrder.expiresAt)) {
      order = { ...activeOrder, nftId: nft.id }
      nft.activeOrderId = order.id
    }

    return [nft, order] as const
  }

  async fetchOrders(nftId: string) {
    const { data } = await client.query({
      query: NFT_ORDERS_QUERY,
      variables: { nftId }
    })
    return data.orders as Order[]
  }

  async fetchTokenId(x: number, y: number) {
    const { data } = await client.query({
      query: PARCEL_TOKEN_ID_QUERY,
      variables: { x, y },
      fetchPolicy: 'cache-first'
    })
    const { tokenId } = data.parcels[0]
    return tokenId as string
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

  if (!!variables.wearableRarities && variables.wearableRarities.length > 0) {
    extraWhere.push(
      `searchWearableRarity_in: [${variables.wearableRarities
        .map(rarity => `"${rarity}"`)
        .join(',')}]`
    )
  }

  if (!!variables.wearableGenders && variables.wearableGenders.length > 0) {
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

  if (!!variables.search) {
    extraWhere.push(
      `searchText_contains: "${variables.search.trim().toLowerCase()}"`
    )
  }

  if (!!variables.contracts && variables.contracts.length > 0) {
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

export const NFT_BY_ADDRESS_AND_ID_QUERY = gql`
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

export const NFT_ORDERS_QUERY = gql`
  query NFTOrders($nftId: String!) {
    orders(
      where: { nft: $nftId, status: sold }
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...orderFragment
    }
  }
  ${orderFragment()}
`

export const PARCEL_TOKEN_ID_QUERY = gql`
  query ParcelTokenId($x: BigInt, $y: BigInt) {
    parcels(where: { x: $x, y: $y }) {
      tokenId
    }
  }
`

export const nftAPI = new NFTAPI()
