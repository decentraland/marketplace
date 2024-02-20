import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { RootState } from '../../../modules/reducer'
import { getMana, getWallet } from '../../../modules/wallet/selectors'
import { getNFTBids } from '../../../modules/ui/nft/bid/selectors'
import { Network } from '@dcl/schemas'
import {
  OwnProps,
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './SaleRentActionBox.types'
import SaleRentActionBox from './SaleRentActionBox'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const wallet = getWallet(state)
  return {
    wallet,
    currentMana:
      ownProps.nft.network === Network.ETHEREUM ||
      ownProps.nft.network === Network.MATIC
        ? getMana(state, ownProps.nft.network)
        : undefined,
    userHasAlreadyBidsOnNft: wallet
      ? getNFTBids(state).some(bid => bid.bidder === wallet.address)
      : false
  }
}

const mapDispatch = (
  dispatch: MapDispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onRent: (selectedPeriodIndex: number) =>
    dispatch(
      openModal('ConfirmRentModal', {
        nft: ownProps.nft,
        rental: ownProps.rental,
        selectedPeriodIndex
      })
    )
})

export default connect(mapState, mapDispatch)(SaleRentActionBox)
