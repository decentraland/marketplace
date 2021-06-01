import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { placeBidRequest, PLACE_BID_REQUEST } from '../../modules/bid/actions'
import { getLoading } from '../../modules/bid/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './BidPage.types'
import BidPage from './BidPage'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  isPlacingBid: isLoadingType(getLoading(state), PLACE_BID_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onPlaceBid: (nft, price, expiresAt, fingerprint) =>
    dispatch(placeBidRequest(nft, price, expiresAt, fingerprint))
})

export default connect(mapState, mapDispatch)(BidPage)
