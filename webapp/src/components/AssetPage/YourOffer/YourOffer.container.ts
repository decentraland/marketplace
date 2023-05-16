import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../../modules/reducer'
import { getAddress } from '../../../modules/wallet/selectors'
import { locations } from '../../../modules/routing/locations'
import { cancelBidRequest } from '../../../modules/bid/actions'
import { MapStateProps, MapDispatchProps, MapDispatch } from './YourOffer.types'
import YourOffer from './YourOffer'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onUpdate: bid =>
    dispatch(push(locations.bid(bid.contractAddress, bid.tokenId))),
  onCancel: bid => dispatch(cancelBidRequest(bid))
})

export default connect(mapState, mapDispatch)(YourOffer)
