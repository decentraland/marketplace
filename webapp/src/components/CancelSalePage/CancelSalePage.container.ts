import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { getLoading } from '../../modules/order/selectors'
import {
  cancelOrderRequest,
  CANCEL_ORDER_REQUEST
} from '../../modules/order/actions'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './CancelSalePage.types'
import CancelSalePage from './CancelSalePage'

const mapState = (state: RootState): MapStateProps => ({
  isLoading: isLoadingType(getLoading(state), CANCEL_ORDER_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onCancelOrder: (order, nft) => dispatch(cancelOrderRequest(order, nft))
})

export default connect(mapState, mapDispatch)(CancelSalePage)
