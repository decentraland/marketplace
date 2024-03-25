import { connect } from 'react-redux'
import { getCurrentOrder } from '../../modules/order/selectors'
import { RootState } from '../../modules/reducer'
import Price from './Price'
import { MapStateProps, OwnProps } from './Price.types'

const mapState = (state: RootState, { asset }: OwnProps): MapStateProps => {
  let price: string | undefined

  if ('price' in asset) {
    price = asset.price
  }

  if ('activeOrderId' in asset) {
    price = getCurrentOrder(state)?.price
  }

  return {
    price
  }
}

export default connect(mapState)(Price)
