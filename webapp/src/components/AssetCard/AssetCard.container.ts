import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getData } from '../../modules/order/selectors'
import { getActiveOrder } from '../../modules/order/utils'
import { MapStateProps, OwnProps, MapDispatchProps } from './AssetCard.types'
import AssetCard from './AssetCard'
import { getView } from '../../modules/ui/browse/selectors'
import { getAssetPrice } from '../../modules/asset/utils'
import { View } from '../../modules/ui/types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  let { order, asset } = ownProps

  if (!order) {
    const orders = getData(state)
    order = getActiveOrder(asset, orders) || undefined
  }

  const view = getView(state)
  const price = getAssetPrice(asset, order)

  return {
    price: getAssetPrice(asset, order),
    showListedTag: Boolean(view === View.CURRENT_ACCOUNT && price)
  }
}

const mapDispatch = (): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(AssetCard)
