import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { cancelOrderRequest } from '../../modules/order/actions'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './CancelSalePage.types'
import CancelSalePage from './CancelSalePage'

const mapState = (_state: RootState): MapStateProps => ({})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onCancelOrder: (order, nft) => dispatch(cancelOrderRequest(order, nft))
})

export default connect(mapState, mapDispatch)(CancelSalePage)
