import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { fetchBidsByAssetRequest } from '../../../modules/bid/actions'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { RootState } from '../../../modules/reducer'
import { getAssetBids } from '../../../modules/ui/asset/bid/selectors'
import { getAddress, getWallet } from '../../../modules/wallet/selectors'
import YourOffer from './BuyNFTBox'
import { MapStateProps, MapDispatchProps } from './BuyNFTBox.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  order: getCurrentOrder(state),
  wallet: getWallet(state),
  bids: getAssetBids(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onFetchBids: asset => dispatch(fetchBidsByAssetRequest(asset))
})

export default connect(mapState, mapDispatch)(YourOffer)
