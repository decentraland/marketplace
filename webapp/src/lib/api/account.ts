import { gql } from 'apollo-boost'

import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'
import { Account } from '../../modules/account/types'
import { FetchAccountOptions } from '../../modules/account/actions'
import { isExpired } from '../../modules/order/utils'
import { nftFragment, NFTFragment } from '../../modules/nft/fragments'
import { client } from './client'

export const ACCOUNT_FILTERS = `
  $first: Int
  $skip: Int
  $isLand: Boolean
`

export const ACCOUNT_NFTS_QUERY = gql`
  query AccountById(
    ${ACCOUNT_FILTERS}
    $address: String!
  ) {
    nfts(
      where: { owner: $address, searchIsLand: $isLand, searchEstateSize_gt: 0 }
      first: $first
      skip: $skip
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

export const ACCOUNT_NFTS_BY_CATEGORY_QUERY = gql`
  query AccountById(
    ${ACCOUNT_FILTERS}
    $address: String!
    $category: Category!
  ) {
    nfts(
      where: { owner: $address, category: $category, searchEstateSize_gt: 0 }
      first: $first
      skip: $skip
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

class AccountAPI {
  fetchAccount = async (options: FetchAccountOptions) => {
    const { variables } = options
    const { address } = variables

    const query =
      variables.category !== undefined
        ? ACCOUNT_NFTS_BY_CATEGORY_QUERY
        : ACCOUNT_NFTS_QUERY

    const { data } = await client.query({
      query,
      variables
    })

    let account: Account | undefined
    const orders: Order[] = []
    const nfts: NFT[] = []

    if (data.nfts.length > 0) {
      account = { id: address, address, nftIds: [] }

      for (const result of data.nfts as NFTFragment[]) {
        const { activeOrder: nestedOrder, ...rest } = result

        const nft: NFT = { ...rest, activeOrderId: null }

        account.nftIds.push(nft.id)
        nfts.push(nft)

        if (nestedOrder && !isExpired(nestedOrder.expiresAt)) {
          const order = { ...nestedOrder, nftId: nft.id }
          nft.activeOrderId = order.id
          orders.push(order)
        }
      }
    }

    return [account, nfts, orders] as const
  }
}

export const accountAPI = new AccountAPI()
