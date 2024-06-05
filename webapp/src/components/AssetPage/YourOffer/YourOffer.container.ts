import { connect } from 'react-redux'
import { cancelBidRequest } from '../../../modules/bid/actions'
import { RootState } from '../../../modules/reducer'
import { getAddress } from '../../../modules/wallet/selectors'
import YourOffer from './YourOffer'
import { MapStateProps, MapDispatchProps, MapDispatch } from './YourOffer.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onCancel: bid => dispatch(cancelBidRequest(bid))
})

export default connect(mapState, mapDispatch)(YourOffer)
