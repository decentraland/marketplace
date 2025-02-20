import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { ACCEPT_BID_REQUEST, acceptBidRequest } from '../../../../modules/bid/actions'
import { getIsBidsOffChainEnabled } from '../../../../modules/features/selectors'
import { RootState } from '../../../../modules/reducer'
import { getAddress, getWallet } from '../../../../modules/wallet/selectors'
import BidsTableContent from './BidsTableContent'
import { MapDispatchProps, MapStateProps } from './BidsTableContent.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  connectedNetwork: getWallet(state)?.network,
  isAcceptingBid: isLoadingType(getLoading(state), ACCEPT_BID_REQUEST),
  isBidsOffchainEnabled: getIsBidsOffChainEnabled(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onAccept: bid => dispatch(acceptBidRequest(bid))
})

export default connect(mapState, mapDispatch)(BidsTableContent)
