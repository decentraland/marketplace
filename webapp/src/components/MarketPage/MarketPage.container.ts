import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import {
  getMarketOrders,
  getUIPage,
  getUISection,
  getUISortBy
} from '../../modules/ui/selectors'
import { getData as getNFTsData } from '../../modules/nft/selectors'
import {
  fetchOrdersRequest,
  FETCH_ORDERS_REQUEST
} from '../../modules/order/actions'
import { getLoading } from '../../modules/order/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './MarketPage.types'
import MarketPage from './MarketPage'

const mapState = (state: RootState): MapStateProps => ({
  nfts: getNFTsData(state),
  orders: getMarketOrders(state),
  page: getUIPage(state),
  section: getUISection(state),
  sortBy: getUISortBy(state),
  isLoading: isLoadingType(getLoading(state), FETCH_ORDERS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchOrders: options => dispatch(fetchOrdersRequest(options)),
  onNavigate: path => dispatch(push(path))
})

export default connect(
  mapState,
  mapDispatch
)(MarketPage)
