import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { getNFTBids } from '../../../modules/ui/nft/bid/selectors'
import { NFT } from '../../../modules/nft/types'
import { openModal } from '../../../modules/modal/actions'
import Actions from './Actions'
import { MapDispatch, MapDispatchProps, MapStateProps } from './Actions.types'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  order: getCurrentOrder(state),
  bids: getNFTBids(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onLeavingSite: (nft: NFT) => dispatch(openModal('LeavingSiteModal', { nft }))
})

export default connect(mapState, mapDispatch)(Actions)
