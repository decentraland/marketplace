import { connect } from 'react-redux'
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
  onBuyWithCrypto: () =>
    dispatch(
      openModal('BuyWithCryptoModal', {
        asset: ownProps.asset
      })
    )
})

export default connect(null, mapDispatch)(BestBuyingOption)
