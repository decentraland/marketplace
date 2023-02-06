import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import { getNFTBids } from '../../../../modules/ui/nft/bid/selectors'
import { getCurrentOrder } from '../../../../modules/order/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './NFTSaleActions.types'
import SaleRentActionBox from './NFTSaleActions'
import { openModal } from '../../../../modules/modal/actions'
import { NFT } from '../../../../modules/nft/types'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  order: getCurrentOrder(state),
  bids: getNFTBids(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onLeavingSite: (nft: NFT) => dispatch(openModal('LeavingSiteModal', { nft }))
})

export default connect(mapState, mapDispatch)(SaleRentActionBox)
