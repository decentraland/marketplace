import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { cancelBidRequest, archiveBid, unarchiveBid, acceptBidRequest, ACCEPT_BID_REQUEST } from '../../modules/bid/actions'
import { getLoading } from '../../modules/bid/selectors'
import { getIsBidsOffChainEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { getArchivedBidIds } from '../../modules/ui/asset/bid/selectors'
import { getWallet } from '../../modules/wallet/selectors'
import Bid from './Bid'
import { MapStateProps, MapDispatchProps, MapDispatch } from './Bid.types'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  archivedBidIds: getArchivedBidIds(state),
  isAcceptingBid: isLoadingType(getLoading(state), ACCEPT_BID_REQUEST),
  isBidsOffchainEnabled: getIsBidsOffChainEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onCancel: bid => dispatch(cancelBidRequest(bid)),
  onArchive: bid => dispatch(archiveBid(bid)),
  onUnarchive: bid => dispatch(unarchiveBid(bid)),
  onAccept: bid => dispatch(acceptBidRequest(bid))
})

export default connect(mapState, mapDispatch)(Bid)
