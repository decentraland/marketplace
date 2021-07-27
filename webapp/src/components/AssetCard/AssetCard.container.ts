import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getData } from '../../modules/order/selectors'
import { MapStateProps, OwnProps, MapDispatchProps } from './AssetCard.types'
import AssetCard from './AssetCard'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  let { order, asset } = ownProps

  if (!order && 'activeOrderId' in asset && asset.activeOrderId) {
    const orders = getData(state)
    order = orders[asset.activeOrderId]
  }

  return {
    order
  }
}

const mapDispatch = (): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(AssetCard)
