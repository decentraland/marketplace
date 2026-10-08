import { connect } from 'react-redux'
import { fetchCancelledTradesRequest } from '../../modules/cancelledTrades/actions'
import {
  getCancelledTrades,
  getCancelledTradesTotal,
  getError,
  hasMoreCancelledTrades,
  isLoadingCancelledTrades
} from '../../modules/cancelledTrades/selectors'
import { RootState } from '../../modules/reducer'
import { getAddress } from '../../modules/wallet/selectors'
import CancelledOrdersBanner from './CancelledOrdersBanner'
import { MapDispatch, MapDispatchProps, MapStateProps } from './CancelledOrdersBanner.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  trades: getCancelledTrades(state),
  total: getCancelledTradesTotal(state),
  hasMore: hasMoreCancelledTrades(state),
  isLoadingMore: isLoadingCancelledTrades(state),
  error: getError(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onLoadMore: (skip: number) => dispatch(fetchCancelledTradesRequest(skip))
})

export default connect(mapState, mapDispatch)(CancelledOrdersBanner)
