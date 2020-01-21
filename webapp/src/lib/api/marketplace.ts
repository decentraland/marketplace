import { gql } from 'apollo-boost'

import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'
import { FetchOrderOptions } from '../../modules/order/actions'
import { orderFragment, OrderFragment } from '../../modules/order/fragments'
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
    orders(
      where: { status: open, search_estate_size_gt: 0, expiresAt_gt: $expiresAt }
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...orderFragment
    }
  }
  ${orderFragment()}
`

export const MARKET_BY_CATEGORY_QUERY = gql`
  query MarketplaceByCategory(
    ${MARKET_FILTERS}
    $category: Category
  ) {
    orders(
      where: { category: $category, status: open, search_estate_size_gt: 0, expiresAt_gt: $expiresAt }
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...orderFragment
    }
  }
  ${orderFragment()}
`

export const NFT_BY_ADDRESS_AND_ID = gql`
  query NFTByAddressAndId($contractAddress: String, $tokenId: String) {
    nfts(
      where: { contractAddress: $contractAddress, tokenId: $tokenId }
      first: 1
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

export const PARCEL_TOKEN_ID = gql`
  query ParcelTokenId($x: BigInt, $y: BigInt) {
    parcels(where: { x: $x, y: $y }) {
      tokenId
    }
  }
`

class MarketplaceAPI {
  fetchOrders = async (options: FetchOrderOptions) => {
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

    for (const result of data.orders as OrderFragment[]) {
      const { nft: nestedNFT, ...rest } = result
      const order = { ...rest, nftId: nestedNFT.id }
      const nft = { ...nestedNFT, activeOrderId: order.id }

      orders.push(order)
      nfts.push(nft)
    }

    return [orders, nfts] as const
  }

  async fetchNFT(contractAddress: string, tokenId: string) {
    const { data } = await client.query({
      query: NFT_BY_ADDRESS_AND_ID,
      variables: {
        contractAddress,
        tokenId
      }
    })
    const { activeOrder: order, ...rest } = data.nfts[0] as NFTFragment
    const nft: NFT = { ...rest, activeOrderId: order ? order.id : null }
    return [nft, order] as const
  }

  async fetchTokenId(x: number, y: number) {
    const { data } = await client.query({
      query: PARCEL_TOKEN_ID,
      variables: {
        x,
        y
      }
    })
    const { tokenId } = data.parcels[0]
    return tokenId as string
  }
}

export const marketplace = new MarketplaceAPI()
