import { Dispatch } from 'redux'
import { Sale } from '@dcl/schemas'
import {
  fetchSalesRequest,
  FetchSalesRequestAction
} from '../../modules/sale/actions'

export type Props = {
  data: Sale[] | null
  isLoading: boolean
  onFetchRecentSales: typeof fetchSalesRequest
}

export type MapStateProps = Pick<Props, 'data' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onFetchRecentSales'>
export type MapDispatch = Dispatch<FetchSalesRequestAction>
