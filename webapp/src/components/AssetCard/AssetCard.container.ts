import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getData } from '../../modules/order/selectors'
import { getActiveOrder } from '../../modules/order/utils'
import { MapStateProps, OwnProps, MapDispatchProps } from './AssetCard.types'
import AssetCard from './AssetCard'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  let { order, asset } = ownProps

  if (!order) {
    const orders = getData(state)
    order = getActiveOrder(asset, orders) || undefined
  }

  return { order }
}

const mapDispatch = (): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(AssetCard)
