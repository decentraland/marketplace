import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Order } from '../../modules/order/types'
import {
  fetchOrdersRequest,
  FetchOrdersRequestAction
} from '../../modules/order/actions'
import { SearchSortBy, SearchSection } from '../../modules/routing/search'
import { NFTState } from '../../modules/nft/reducer'

export type Props = {
  nfts: NFTState['data']
  orders: Order[]
  page: number
  section: SearchSection
  sortBy: SearchSortBy
  isLoading: boolean
  onFetchOrders: typeof fetchOrdersRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'nfts' | 'orders' | 'page' | 'section' | 'sortBy' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onFetchOrders' | 'onNavigate'>
export type MapDispatch = Dispatch<
  FetchOrdersRequestAction | CallHistoryMethodAction
>
