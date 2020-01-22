import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { getData } from '../../modules/order/selectors'
import {
  MapStateProps,
  OwnProps,
  MapDispatch,
  MapDispatchProps
} from './NFTCard.types'
import NFTCard from './NFTCard'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  let { order, nft } = ownProps

  if (!order && nft.activeOrderId) {
    const orders = getData(state)
    order = orders[nft.activeOrderId]
  }

  return {
    order
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(NFTCard)
