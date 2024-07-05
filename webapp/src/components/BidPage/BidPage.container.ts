import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { placeBidRequest, PLACE_BID_REQUEST, clearBidError } from '../../modules/bid/actions'
import { getLoading } from '../../modules/bid/selectors'
import { getContract } from '../../modules/contract/selectors'
import { getIsBidsOffChainEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { Contract } from '../../modules/vendor/services'
import BidPage from './BidPage'
import { MapStateProps, MapDispatchProps, MapDispatch } from './BidPage.types'

const mapState = (state: RootState): MapStateProps => ({
  isPlacingBid: isLoadingType(getLoading(state), PLACE_BID_REQUEST),
  isBidsOffchainEnabled: getIsBidsOffChainEnabled(state),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onPlaceBid: (nft, price, expiresAt, fingerprint) => dispatch(placeBidRequest(nft, price, expiresAt, fingerprint)),
  onClearBidError: () => dispatch(clearBidError())
})

export default connect(mapState, mapDispatch)(BidPage)
