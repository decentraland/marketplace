import { Dispatch } from 'redux'

import {
  fetchAccountRequest,
  FetchAccountRequestAction
} from '../../modules/account/actions'
import { Account } from '../../modules/account/types'
import { NFTState } from '../../modules/nft/reducer'

export type Props = {
  address: string
  account?: Account
  nfts: NFTState['data']
  isLoading: boolean
  onFetchAccount: typeof fetchAccountRequest
}

export type MapStateProps = Pick<Props, 'account' | 'nfts' | 'isLoading'>
export type OwnProps = Pick<Props, 'address'>
export type MapDispatchProps = Pick<Props, 'onFetchAccount'>
export type MapDispatch = Dispatch<FetchAccountRequestAction>
