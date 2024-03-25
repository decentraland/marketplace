import { connect } from 'react-redux'
import { Network } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getIsLandCrossChainEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import { getNFTBids } from '../../../modules/ui/nft/bid/selectors'
import { getMana, getWallet } from '../../../modules/wallet/selectors'
import SaleRentActionBox from './SaleRentActionBox'
import { OwnProps, MapStateProps, MapDispatchProps, MapDispatch } from './SaleRentActionBox.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const wallet = getWallet(state)
  return {
    wallet,
    currentMana:
      ownProps.nft.network === Network.ETHEREUM || ownProps.nft.network === Network.MATIC
        ? getMana(state, ownProps.nft.network)
        : undefined,
    userHasAlreadyBidsOnNft: wallet ? getNFTBids(state).some(bid => bid.bidder === wallet.address) : false,
    isCrossChainLandEnabled: getIsLandCrossChainEnabled(state)
  }
}

const mapDispatch = (dispatch: MapDispatch, ownProps: OwnProps): MapDispatchProps => ({
  onBuyWithCrypto: () =>
    dispatch(
      openModal('BuyNftWithCryptoModal', {
        nft: ownProps.nft,
        order: ownProps.order,
        slippage: 2 // Since LANDs are expensive, let's increment the slippage for this txs
      })
    ),
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
