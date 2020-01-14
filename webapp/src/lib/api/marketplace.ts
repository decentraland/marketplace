import { gql } from 'apollo-boost'

import { Order } from '../../modules/order/types'
import { FetchOrderOptions } from '../../modules/order/actions'
import { orderFields } from '../../modules/order/fragments'
import { client } from './client'

export const MARKET_FILTERS = `$first: Int
$skip: Int
$orderBy: String
$orderDirection: String`

export const MARKET_QUERY = gql`
  query Marketplace(
    ${MARKET_FILTERS}
  ) {
    orders(
      where: { status: open, search_estate_size_gt: 0 }
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...orderFields
    }
  }
  ${orderFields}
`

export const MARKET_BY_CATEGORY_QUERY = gql`
  query MarketplaceByCategory(
    ${MARKET_FILTERS}
    $category: Category
  ) {
    orders(
      where: { category: $category, status: open }
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...orderFields
    }
  }
  ${orderFields}
`

class MarketplaceAPI {
  fetchOrders = async (options: FetchOrderOptions) => {
    const query =
      options.variables.category !== undefined
        ? MARKET_BY_CATEGORY_QUERY
        : MARKET_QUERY

    const { data } = await client.query({
      query,
      variables: options.variables
    })

    return data.orders as Order[]
  }
}

export const marketplace = new MarketplaceAPI()
