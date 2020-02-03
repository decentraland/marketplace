import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Order } from '../../modules/order/types'
import {
  fetchNFTsRequest,
  FetchNFTsRequestAction
} from '../../modules/nft/actions'
import { SortBy, Section } from '../../modules/routing/search'
import { NFTState } from '../../modules/nft/reducer'

export type Props = {
  nfts: NFTState['data']
  orders: Order[]
  page: number
  section: Section
  sortBy: SortBy
  isLoading: boolean
  onFetchNFTs: typeof fetchNFTsRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'nfts' | 'orders' | 'page' | 'section' | 'sortBy' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onFetchNFTs' | 'onNavigate'>
export type MapDispatch = Dispatch<
  FetchNFTsRequestAction | CallHistoryMethodAction
>
