import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { getArchivedBidIds } from '../../modules/ui/selectors'
import { locations } from '../../modules/routing/locations'
import {
  cancelBidRequest,
  archiveBid,
  unarchiveBid,
  acceptBidRequest
} from '../../modules/bid/actions'
import { getWallet } from '../../modules/wallet/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './Bid.types'
import Bid from './Bid'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  archivedBidIds: getArchivedBidIds(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onUpdate: bid =>
    dispatch(push(locations.bid(bid.contractAddress, bid.tokenId))),
  onCancel: bid => dispatch(cancelBidRequest(bid)),
  onArchive: bid => dispatch(archiveBid(bid)),
  onUnarchive: bid => dispatch(unarchiveBid(bid)),
  onAccept: bid => dispatch(acceptBidRequest(bid))
})

export default connect(mapState, mapDispatch)(Bid)
