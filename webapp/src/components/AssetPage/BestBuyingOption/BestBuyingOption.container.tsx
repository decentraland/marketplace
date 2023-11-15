import { connect } from 'react-redux'
import { Order } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import {
  OwnProps,
  MapDispatchProps,
  MapDispatch
} from './BestBuyingOption.types'
import BestBuyingOption from './BestBuyingOption'

const mapDispatch = (
  dispatch: MapDispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onBuyWithCrypto: (order?: Order) =>
    dispatch(
      openModal('BuyNFTWithCryptoModal', {
        asset: ownProps.asset,
        order
      })
    )
})

export default connect(null, mapDispatch)(BestBuyingOption)
