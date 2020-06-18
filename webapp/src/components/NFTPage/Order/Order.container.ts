import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Order.types'
import { getCurrentOrder } from '../../../modules/order/selectors'
import Order from './Order'

const mapState = (state: RootState): MapStateProps => {
  return {
    order: getCurrentOrder(state)
  }
}

const mapDispatch = (_: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(Order)
