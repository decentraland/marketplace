import { Dispatch } from 'redux'

import {
  fetchNFTsRequest,
  FetchNFTsRequestAction
} from '../../modules/nft/actions'
import { View } from '../../modules/ui/types'
import { Vendors } from '../../modules/vendor/types'
import { Section, SortBy } from '../../modules/routing/search'

export type Props = {
  section: Section
  sortBy: SortBy
  search: string
  onlyOnSale?: boolean
  page: number
  vendor: Vendors
  view: View
  address?: string
  defaultOnlyOnSale: boolean
  onFetchNFTs: typeof fetchNFTsRequest
}

export type MapStateProps = Pick<
  Props,
  'section' | 'sortBy' | 'search' | 'page' | 'onlyOnSale'
>
export type MapDispatchProps = Pick<Props, 'onFetchNFTs'>
export type MapDispatch = Dispatch<FetchNFTsRequestAction>
export type OwnProps = Pick<
  Props,
  'vendor' | 'vendor' | 'address' | 'defaultOnlyOnSale'
>
