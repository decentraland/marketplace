import { gql } from 'apollo-boost'

import { client } from '../apiClient'
import { orderFragment, OrderFragment } from './fragments'

class OrderAPI {
  async fetchByNFT(nftId: string) {
    const { data } = await client.query<{ orders: OrderFragment[] }>({
      query: NFT_ORDERS_QUERY,
      variables: { nftId }
    })
    return data.orders
  }
}

const NFT_ORDERS_QUERY = gql`
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

export const orderAPI = new OrderAPI()
