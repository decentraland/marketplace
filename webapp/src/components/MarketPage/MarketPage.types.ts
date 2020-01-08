import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Order } from '../../modules/order/types'
import {
  fetchOrdersRequest,
  FetchOrdersRequestAction
} from '../../modules/order/actions'
import { MarketSortBy, MarketSection } from '../../modules/routing/locations'

export type Props = {
  orders: Order[]
  page: number
  section: MarketSection
  sortBy: MarketSortBy
  isLoading: boolean
  onFetchOrders: typeof fetchOrdersRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'orders' | 'page' | 'section' | 'sortBy' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onFetchOrders' | 'onNavigate'>
export type MapDispatch = Dispatch<
  FetchOrdersRequestAction | CallHistoryMethodAction
>
