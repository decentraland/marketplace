import { gql } from 'apollo-boost'

import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'
import { FetchOrderOptions } from '../../modules/order/actions'
import { client } from './client'
import { nftFragment, NFTFragment } from '../../modules/nft/fragments'

const MARKET_FILTERS = `
  $first: Int
  $skip: Int
  $orderBy: String
  $orderDirection: String
  $expiresAt: String
`

const MARKET_ARGUMENTS = `
  first: $first
  skip: $skip
  #orderBy: $orderBy
  #orderDirection: $orderDirection
`

export const MARKET_FULL_QUERY = gql`
  query Marketplace(
    ${MARKET_FILTERS}
  ) {
    nfts(
      where: { searchOrderStatus: open, searchEstateSize_gt: 0, searchOrderExpiresAt_gt: $expiresAt }
      ${MARKET_ARGUMENTS}
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

export const MARKET_LAND_QUERY = gql`
  query MarketplaceLAND(
    ${MARKET_FILTERS}
    $isLand: Boolean = false
  ) {
    nfts(
      where: { searchIsLand: $isLand, searchOrderStatus: open, searchEstateSize_gt: 0, searchOrderExpiresAt_gt: $expiresAt }
      ${MARKET_ARGUMENTS}
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

export const MARKET_BY_CATEGORY_QUERY = gql`
  query MarketplaceByCategory(
    ${MARKET_FILTERS}
    $category: Category
  ) {
    nfts(
      where: { category: $category, searchOrderStatus: open, searchEstateSize_gt: 0, searchOrderExpiresAt_gt: $expiresAt }
      ${MARKET_ARGUMENTS}
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

class MarketplaceAPI {
  fetch = async (options: FetchOrderOptions) => {
    const { variables } = options
    const query =
      variables.category !== undefined
        ? MARKET_BY_CATEGORY_QUERY
        : variables.isLand
        ? MARKET_LAND_QUERY
        : MARKET_FULL_QUERY

    const { data } = await client.query({
      query,
      variables: {
        ...variables,
        expiresAt: Date.now().toString()
      }
    })

    const orders: Order[] = []
    const nfts: NFT[] = []

    for (const result of data.nfts as NFTFragment[]) {
      const { activeOrder: nestedOrder, ...rest } = result
      const nft = { ...rest, activeOrderId: nestedOrder!.id }
      const order = { ...nestedOrder!, nftId: nft.id }

      nfts.push(nft)
      orders.push(order)
    }

    return [orders, nfts] as const
  }
}

export const marketplaceAPI = new MarketplaceAPI()
