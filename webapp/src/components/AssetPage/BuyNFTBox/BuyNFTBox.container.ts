import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getAddress } from '../../../modules/wallet/selectors'
import { MapStateProps } from './BuyNFTBox.types'
import YourOffer from './BuyNFTBox'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state)
})

export default connect(mapState)(YourOffer)
