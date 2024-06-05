import { connect } from 'react-redux'
import { Order } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getOpenModals } from 'decentraland-dapps/dist/modules/modal/selectors'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Asset, AssetType } from '../../../../modules/asset/types'
import { buyItemWithCardRequest } from '../../../../modules/item/actions'
import { executeOrderWithCardRequest } from '../../../../modules/order/actions'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import BuyNFTButtons from './BuyNFTButtons'
import { MapDispatchProps, MapDispatch, MapStateProps, OwnProps } from './BuyNFTButtons.types'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  isConnecting: isConnecting(state),
  isBuyingWithCryptoModalOpen: getOpenModals(state)['BuyNftWithCryptoModal']?.open || getOpenModals(state)['MintNftWithCryptoModal']?.open
})

const mapDispatch = (dispatch: MapDispatch, ownProps: OwnProps): MapDispatchProps => ({
  onExecuteOrderWithCard: nft => dispatch(executeOrderWithCardRequest(nft)),
  onBuyWithCrypto: (asset: Asset, order?: Order | null) =>
    ownProps.assetType === AssetType.NFT
      ? dispatch(
          openModal('BuyNftWithCryptoModal', {
            nft: asset,
            order
          })
        )
      : dispatch(openModal('MintNftWithCryptoModal', { item: asset })),
  onBuyItemWithCard: item => dispatch(buyItemWithCardRequest(item))
})

export default connect(mapState, mapDispatch)(BuyNFTButtons)
