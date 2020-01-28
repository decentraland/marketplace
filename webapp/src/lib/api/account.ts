import { gql } from 'apollo-boost'

import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'
import { Account } from '../../modules/account/types'
import { FetchAccountOptions } from '../../modules/account/actions'
import { isExpired } from '../../modules/order/utils'
import { nftFragment, NFTFragment } from '../../modules/nft/fragments'
import { client } from './client'

const ACCOUNT_FILTERS = `
  $first: Int
  $skip: Int
`

const ACCOUNT_ARGUMENTS = `
  first: $first
  skip: $skip
`

export const ACCOUNT_NFTS_FULL_QUERY = gql`
  query AccountById(
    ${ACCOUNT_FILTERS}
    $address: String!
  ) {
    nfts(
      where: { owner: $address, searchEstateSize_gt: 0 }
      ${ACCOUNT_ARGUMENTS}
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

export const ACCOUNT_NFTS_LAND_QUERY = gql`
  query AccountById(
    ${ACCOUNT_FILTERS}
    $address: String!
    $isLand: Boolean = false
  ) {
    nfts(
      where: { owner: $address, searchIsLand: $isLand, searchEstateSize_gt: 0 }
      ${ACCOUNT_ARGUMENTS}
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
      ${ACCOUNT_ARGUMENTS}
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
        : variables.isLand
        ? ACCOUNT_NFTS_LAND_QUERY
        : ACCOUNT_NFTS_FULL_QUERY

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
