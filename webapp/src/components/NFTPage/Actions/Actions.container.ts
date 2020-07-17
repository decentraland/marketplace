import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../../modules/reducer'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Actions.types'
import { getWallet } from '../../../modules/wallet/selectors'
import { getCurrentOrder } from '../../../modules/order/selectors'
import Actions from './Actions'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    order: getCurrentOrder(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Actions)
