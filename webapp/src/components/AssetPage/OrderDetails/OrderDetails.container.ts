import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './OrderDetails.types'
import { getCurrentOrder } from '../../../modules/order/selectors'
import OrderDetails from './OrderDetails'

const mapState = (state: RootState): MapStateProps => ({
  order: getCurrentOrder(state)
})

const mapDispatch = (_: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(OrderDetails)
