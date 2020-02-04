import { Dispatch } from 'redux'

import {
  fetchNFTsRequest,
  FetchNFTsRequestAction
} from '../../modules/nft/actions'
import { Account } from '../../modules/account/types'
import { NFT } from '../../modules/nft/types'
import { View } from '../../modules/ui/types'
import { Section, SortBy, SearchOptions } from '../../modules/routing/search'

export type Props = {
  onlyOnSale: boolean
  address?: string
  account?: Account
  nfts: NFT[]
  page: number
  section: Section
  sortBy: SortBy
  view: View
  isLoading: boolean
  onNavigate: (options?: SearchOptions) => void
  onFetchNFTs: typeof fetchNFTsRequest
}

export type MapStateProps = Pick<
  Props,
  'account' | 'nfts' | 'page' | 'section' | 'sortBy' | 'isLoading'
>
export type OwnProps = Pick<
  Props,
  'address' | 'onlyOnSale' | 'view' | 'onNavigate'
>
export type MapDispatchProps = Pick<Props, 'onFetchNFTs'>
export type MapDispatch = Dispatch<FetchNFTsRequestAction>
