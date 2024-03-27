import { connect } from 'react-redux'
import { Order } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../../modules/nft/types'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { RootState } from '../../../modules/reducer'
import { getNFTBids } from '../../../modules/ui/nft/bid/selectors'
import { getWallet } from '../../../modules/wallet/selectors'
import Actions from './Actions'
import { MapDispatch, MapDispatchProps, MapStateProps, OwnProps } from './Actions.types'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  order: getCurrentOrder(state),
  bids: getNFTBids(state)
})

const mapDispatch = (dispatch: MapDispatch, ownProps: OwnProps): MapDispatchProps => ({
  onLeavingSite: (nft: NFT) => dispatch(openModal('LeavingSiteModal', { nft })),
  onBuyWithCrypto: (order: Order) =>
    dispatch(
      openModal('BuyNftWithCryptoModal', {
        nft: ownProps.nft,
        order
      })
    )
})

export default connect(mapState, mapDispatch)(Actions)
