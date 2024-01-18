import { connect } from 'react-redux'
import { replace } from 'connected-react-router'
import { Order } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getOpenModals } from 'decentraland-dapps/dist/modules/modal/selectors'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import {
  MapDispatchProps,
  MapDispatch,
  MapStateProps
} from './BuyNFTButtons.types'
import { executeOrderWithCardRequest } from '../../../../modules/order/actions'
import { buyItemWithCardRequest } from '../../../../modules/item/actions'
import { Asset } from '../../../../modules/asset/types'
import { RootState } from '../../../../modules/reducer'
import { getIsBuyCrossChainEnabled } from '../../../../modules/features/selectors'
import { getWallet } from '../../../../modules/wallet/selectors'
import BuyNFTButtons from './BuyNFTButtons'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  isConnecting: isConnecting(state),
  isBuyCrossChainEnabled: getIsBuyCrossChainEnabled(state),
  isBuyingWithCryptoModalOpen: getOpenModals(state)['BuyNFTWithCryptoModal']
    ?.open
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onExecuteOrderWithCard: nft => dispatch(executeOrderWithCardRequest(nft)),
  onBuyWithCrypto: (asset: Asset, order?: Order | null) =>
    dispatch(
      openModal('BuyNFTWithCryptoModal', {
        asset,
        order
      })
    ),
  onBuyItemWithCard: item => dispatch(buyItemWithCardRequest(item)),
  onRedirect: path => dispatch(replace(path))
})

export default connect(mapState, mapDispatch)(BuyNFTButtons)
