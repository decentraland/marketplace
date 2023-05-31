import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { placeBidRequest, PLACE_BID_REQUEST, clearBidError } from '../../modules/bid/actions'
import { getLoading } from '../../modules/bid/selectors'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'
import { MapStateProps, MapDispatchProps, MapDispatch } from './BidPage.types'
import BidPage from './BidPage'

const mapState = (state: RootState): MapStateProps => ({
  isPlacingBid: isLoadingType(getLoading(state), PLACE_BID_REQUEST),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onPlaceBid: (nft, price, expiresAt, fingerprint) =>
    dispatch(placeBidRequest(nft, price, expiresAt, fingerprint)),
  onClearBidError: () => dispatch(clearBidError())
})

export default connect(mapState, mapDispatch)(BidPage)
