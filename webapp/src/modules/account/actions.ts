import { action } from 'typesafe-actions'

import { NFT } from '../nft/types'
import { Order } from '../order/types'
import { Account } from './types'

// Fetch Account

export const FETCH_ACCOUNT_REQUEST = '[Request] Fetch Account'
export const FETCH_ACCOUNT_SUCCESS = '[Success] Fetch Account'
export const FETCH_ACCOUNT_FAILURE = '[Failure] Fetch Account'

export type FetchAccountOptions = {
  variables: {
    address: string
  }
}

export const fetchAccountRequest = (options: FetchAccountOptions) =>
  action(FETCH_ACCOUNT_REQUEST, { options })
export const fetchAccountSuccess = (
  options: FetchAccountOptions,
  account: Account,
  nfts: NFT[],
  orders: Order[]
) => action(FETCH_ACCOUNT_SUCCESS, { options, account, nfts, orders })
export const fetchAccountFailure = (
  options: FetchAccountOptions,
  error: string
) => action(FETCH_ACCOUNT_FAILURE, { options, error })

export type FetchAccountRequestAction = ReturnType<typeof fetchAccountRequest>
export type FetchAccountSuccessAction = ReturnType<typeof fetchAccountSuccess>
export type FetchAccountFailureAction = ReturnType<typeof fetchAccountFailure>
