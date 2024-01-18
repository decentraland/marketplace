import { connect } from 'react-redux'
import { replace } from 'connected-react-router'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import {
  getBidderBids,
  getSellerBids,
  getArchivedBidIds
} from '../../modules/ui/nft/bid/selectors'
import { getLoading } from '../../modules/bid/selectors'
import {
  fetchBidsByAddressRequest,
  FETCH_BIDS_BY_ADDRESS_REQUEST
} from '../../modules/bid/actions'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Bids.types'
import Bids from './Bids'

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
  onNavigate: path => dispatch(replace(path)),
  onFetchBids: address => dispatch(fetchBidsByAddressRequest(address))
})

export default connect(mapState, mapDispatch)(Bids)
