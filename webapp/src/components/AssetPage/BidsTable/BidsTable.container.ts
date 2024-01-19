import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getAddress } from '../../../modules/wallet/selectors'
import {
  ACCEPT_BID_REQUEST,
  acceptBidRequest
} from '../../../modules/bid/actions'
import { MapDispatch, MapDispatchProps, MapStateProps } from './BidsTable.types'
import BidsTable from './BidsTable'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  isAcceptingBid: isLoadingType(getLoading(state), ACCEPT_BID_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onAccept: bid => dispatch(acceptBidRequest(bid))
})

export default connect(mapState, mapDispatch)(BidsTable)
