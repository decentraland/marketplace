import { Dispatch } from 'redux'

import {
  fetchAccountRequest,
  FetchAccountRequestAction
} from '../../modules/account/actions'
import { Account } from '../../modules/account/types'
import { NFT } from '../../modules/nft/types'
import { Section, SortBy } from '../../modules/routing/search'

export type Props = {
  address: string
  account?: Account
  nfts: NFT[]
  page: number
  section: Section
  sortBy: SortBy
  isLoading: boolean
  onFetchAccount: typeof fetchAccountRequest
}

export type MapStateProps = Pick<
  Props,
  'account' | 'nfts' | 'page' | 'section' | 'sortBy' | 'isLoading'
>
export type OwnProps = Pick<Props, 'address'>
export type MapDispatchProps = Pick<Props, 'onFetchAccount'>
export type MapDispatch = Dispatch<FetchAccountRequestAction>
