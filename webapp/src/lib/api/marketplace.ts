import { gql } from 'apollo-boost'

import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'
import { FetchOrderOptions } from '../../modules/order/actions'
import { client } from './client'
import { nftFragment, NFTFragment } from '../../modules/nft/fragments'

export const MARKET_FILTERS = `$first: Int
$skip: Int
$orderBy: String
$orderDirection: String
$expiresAt: String`

export const MARKET_QUERY = gql`
  query Marketplace(
    ${MARKET_FILTERS}
  ) {
    nfts(
      where: { searchOrderStatus: open, searchEstateSize_gt: 0, searchOrderExpiresAt_gt: $expiresAt }
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
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
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

class MarketplaceAPI {
  fetch = async (options: FetchOrderOptions) => {
    const query =
      options.variables.category !== undefined
        ? MARKET_BY_CATEGORY_QUERY
        : MARKET_QUERY

    const { data } = await client.query({
      query,
      variables: {
        ...options.variables,
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
