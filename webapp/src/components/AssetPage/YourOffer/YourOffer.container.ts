import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { cancelBidRequest } from '../../../modules/bid/actions'
import { RootState } from '../../../modules/reducer'
import { locations } from '../../../modules/routing/locations'
import { getAddress } from '../../../modules/wallet/selectors'
import YourOffer from './YourOffer'
import { MapStateProps, MapDispatchProps, MapDispatch } from './YourOffer.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onUpdate: bid => dispatch(push(locations.bid(bid.contractAddress, bid.tokenId))),
  onCancel: bid => dispatch(cancelBidRequest(bid))
})

export default connect(mapState, mapDispatch)(YourOffer)
