import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getAddress, getWallet } from '../../../modules/wallet/selectors'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { MapStateProps } from './BuyNFTBox.types'
import YourOffer from './BuyNFTBox'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  order: getCurrentOrder(state),
  wallet: getWallet(state)
})

export default connect(mapState)(YourOffer)
