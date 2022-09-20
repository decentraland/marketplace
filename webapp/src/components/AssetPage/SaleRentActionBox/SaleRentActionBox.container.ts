import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { getNFTBids } from '../../../modules/ui/nft/bid/selectors'
import { isOwnedBy } from '../../../modules/asset/utils'
import SaleRentActionBox from './SaleRentActionBox'
import {
  OwnProps,
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './SaleRentActionBox.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const wallet = getWallet(state)
  return {
    userHasAlreadyBidsOnNft: wallet
      ? getNFTBids(state).some(bid => bid.bidder === wallet.address)
      : false,
    isOwner: isOwnedBy(ownProps.nft, wallet)
  }
}

const mapDispatch = (
  dispatch: MapDispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  // TODO: Open the corresponding modals
  onBid: () => dispatch(openModal('BidModal', { nft: ownProps.nft })),
  onSell: () =>
    dispatch(
      openModal('SellModal', { nft: ownProps.nft, order: ownProps.order })
    ),
  onRent: () =>
    dispatch(
      openModal('RentModal', { nft: ownProps.nft, rental: ownProps.rental })
    )
})

export default connect(mapState, mapDispatch)(SaleRentActionBox)
