import { connect } from 'react-redux'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { RootState } from '../../../modules/reducer'
import { getAddress, getWallet } from '../../../modules/wallet/selectors'
import YourOffer from './BuyNFTBox'
import { MapStateProps } from './BuyNFTBox.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  order: getCurrentOrder(state),
  wallet: getWallet(state)
})

export default connect(mapState)(YourOffer)
