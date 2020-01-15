import { gql } from 'apollo-boost'

import { Order } from '../../modules/order/types'
import { FetchOrderOptions } from '../../modules/order/actions'
import { accountFields } from '../../modules/account/fragments'
import { client } from './client'

export const ACCOUNT_QUERY = gql`
  query AccountById(id: String!) {
    wallets(
      where: { id: $id }
    ) {
      ...addressFields
    }
  }
  ${accountFields}
`

class AccountAPI {
  fetchAccount = async (options: FetchOrderOptions) => {
    const query = ACCOUNT_QUERY

    const { data } = await client.query({
      query,
      variables: options.variables
    })

    return data.orders as Order[]
  }
}

export const marketplace = new AccountAPI()
