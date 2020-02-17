import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getData } from '../../modules/order/selectors'
import { MapStateProps, OwnProps, MapDispatchProps } from './NFTCard.types'
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

const mapDispatch = (): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(NFTCard)
