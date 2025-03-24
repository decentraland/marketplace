import { connect } from 'react-redux'
import { Order } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getOpenModals } from 'decentraland-dapps/dist/modules/modal/selectors'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Asset, AssetType } from '../../../../modules/asset/types'
import { getCredits } from '../../../../modules/credits/selectors'
import { getIsCreditsEnabled, getIsCreditsSecondarySalesEnabled } from '../../../../modules/features/selectors'
import { buyItemWithCardRequest } from '../../../../modules/item/actions'
import { executeOrderWithCardRequest } from '../../../../modules/order/actions'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import BuyNFTButtons from './BuyNFTButtons'
import { MapDispatchProps, MapDispatch, MapStateProps, OwnProps } from './BuyNFTButtons.types'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)
  return {
    wallet: wallet,
    credits: getCredits(state, wallet?.address || ''),
    isConnecting: isConnecting(state),
    isBuyingWithCryptoModalOpen:
      getOpenModals(state)['BuyNftWithCryptoModal']?.open || getOpenModals(state)['MintNftWithCryptoModal']?.open,
    isCreditsEnabled: getIsCreditsEnabled(state),
    isCreditsSecondarySalesEnabled: getIsCreditsSecondarySalesEnabled(state)
  }
}

const mapDispatch = (dispatch: MapDispatch, ownProps: OwnProps): MapDispatchProps => ({
  onExecuteOrderWithCard: (nft, order?: Order, useCredits = false) => dispatch(executeOrderWithCardRequest(nft, order, useCredits)),
  onBuyWithCrypto: (asset: Asset, order?: Order | null, useCredits?: boolean) =>
    ownProps.assetType === AssetType.NFT
      ? dispatch(
          openModal('BuyNftWithCryptoModal', {
            nft: asset,
            order,
            useCredits
          })
        )
      : dispatch(openModal('MintNftWithCryptoModal', { item: asset, useCredits })),
  onBuyItemWithCard: (item, useCredits) => dispatch(buyItemWithCardRequest(item, useCredits))
})

export default connect(mapState, mapDispatch)(BuyNFTButtons)
