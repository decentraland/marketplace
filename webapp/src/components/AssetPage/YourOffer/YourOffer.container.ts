import { connect } from 'react-redux'
import { cancelBidRequest, fetchBidsByAssetRequest } from '../../../modules/bid/actions'
import { RootState } from '../../../modules/reducer'
import { getAssetBids } from '../../../modules/ui/asset/bid/selectors'
import { getAddress } from '../../../modules/wallet/selectors'
import YourOffer from './YourOffer'
import { MapStateProps, MapDispatchProps, MapDispatch } from './YourOffer.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  bids: getAssetBids(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onCancel: bid => dispatch(cancelBidRequest(bid)),
  onFetchBids: asset => dispatch(fetchBidsByAssetRequest(asset))
})

export default connect(mapState, mapDispatch)(YourOffer)
