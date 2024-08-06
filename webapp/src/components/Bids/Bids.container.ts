import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { fetchBidsByAddressRequest, FETCH_BIDS_BY_ADDRESS_REQUEST } from '../../modules/bid/actions'
import { getLoading } from '../../modules/bid/selectors'
import { RootState } from '../../modules/reducer'
import { getBidderBids, getSellerBids, getArchivedBidIds } from '../../modules/ui/asset/bid/selectors'
import { getWallet } from '../../modules/wallet/selectors'
import Bids from './Bids'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Bids.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    sellerBids: getSellerBids(state),
    bidderBids: getBidderBids(state),
    archivedBidIds: getArchivedBidIds(state),
    isConnecting: isConnecting(state),
    isLoading: isLoadingType(getLoading(state), FETCH_BIDS_BY_ADDRESS_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchBids: address => dispatch(fetchBidsByAddressRequest(address))
})

export default connect(mapState, mapDispatch)(Bids)
