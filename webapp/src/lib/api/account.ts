import { gql } from 'apollo-boost'

import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'
import { Account } from '../../modules/account/types'
import { FetchAccountOptions } from '../../modules/account/actions'
import {
  accountFragment,
  AccountFragment
} from '../../modules/account/fragments'
import { client } from './client'

export const ACCOUNT_QUERY = gql`
  query AccountById($address: String!) {
    wallets(where: { id: $address }) {
      ...accountFragment
    }
  }
  ${accountFragment()}
`

class AccountAPI {
  fetchAccount = async (options: FetchAccountOptions) => {
    const { data } = await client.query({
      query: ACCOUNT_QUERY,
      variables: options.variables
    })

    // TODO: Handle account not found

    let account: Account | undefined
    const orders: Order[] = []
    const nfts: NFT[] = []

    const result = data.wallets[0] as AccountFragment | undefined

    if (result) {
      const { nfts: nestedNFTs, ...rest } = result
      account = { ...rest, nftIds: [] }

      for (const nestedNFT of nestedNFTs) {
        const nft: NFT = { ...nestedNFT, activeOrderId: null }

        account.nftIds.push(nft.id)
        nfts.push(nft)

        if (nestedNFT.activeOrder) {
          const order = { ...nestedNFT.activeOrder, nftId: nestedNFT.id }

          nft.activeOrderId = order.id
          orders.push(order)
        }
      }

      // TODO: This should be supported on the backend
      account.address = options.variables.address
    }

    return [account, nfts, orders]
  }
}

export const account = new AccountAPI()
