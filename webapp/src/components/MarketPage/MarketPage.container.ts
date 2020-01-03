import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './MarketPage.types'
import MarketPage from './MarketPage'
import {
  getMarketOrders,
  getMarketPage,
  getMarketSection,
  getMarketSortBy
} from '../../modules/ui/selectors'
import {
  fetchOrdersRequest,
  FETCH_ORDERS_REQUEST
} from '../../modules/order/actions'
import { getLoading } from '../../modules/order/selectors'

const mapState = (state: RootState): MapStateProps => ({
  orders: getMarketOrders(state),
  page: getMarketPage(state),
  section: getMarketSection(state),
  sortBy: getMarketSortBy(state),
  isLoading: isLoadingType(getLoading(state), FETCH_ORDERS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchOrders: options => dispatch(fetchOrdersRequest(options)),
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(MarketPage)
