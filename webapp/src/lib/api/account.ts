import { gql } from 'apollo-boost'

import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'
import { Account } from '../../modules/account/types'
import { FetchAccountOptions } from '../../modules/account/actions'
import { nftFragment, NFTFragment } from '../../modules/nft/fragments'
import { client } from './client'

export const ACCOUNT_FILTERS = `$first: Int
$skip: Int`

export const ACCOUNT_NFTS_QUERY = gql`
  query AccountById(
    $address: String!
    ${ACCOUNT_FILTERS}
  ) {
    nfts(
      where: { owner: $address }
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
    $address: String!
    $category: Category!
    ${ACCOUNT_FILTERS}
  ) {
    nfts(
      where: { owner: $address, category: $category }
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
    const query =
      options.variables.category !== undefined
        ? ACCOUNT_NFTS_BY_CATEGORY_QUERY
        : ACCOUNT_NFTS_QUERY

    const { address } = options.variables

    const { data } = await client.query({
      query,
      variables: options.variables
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

        if (nestedOrder) {
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
