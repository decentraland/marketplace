import { Dispatch } from 'redux'

import {
  fetchNFTsRequest,
  FetchNFTsRequestAction
} from '../../modules/nft/actions'
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
  onFetchNFTs: typeof fetchNFTsRequest
}

export type MapStateProps = Pick<
  Props,
  'account' | 'nfts' | 'page' | 'section' | 'sortBy' | 'isLoading'
>
export type OwnProps = Pick<Props, 'address'>
export type MapDispatchProps = Pick<Props, 'onFetchNFTs'>
export type MapDispatch = Dispatch<FetchNFTsRequestAction>
