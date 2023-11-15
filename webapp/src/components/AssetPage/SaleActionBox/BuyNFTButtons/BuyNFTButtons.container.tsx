import { connect } from 'react-redux'
import { Order } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { MapDispatchProps, MapDispatch } from './BuyNFTButtons.types'
import { executeOrderWithCardRequest } from '../../../../modules/order/actions'
import { buyItemWithCardRequest } from '../../../../modules/item/actions'
import { Asset } from '../../../../modules/asset/types'
import BuyNFTButtons from './BuyNFTButtons'

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onExecuteOrderWithCard: nft => dispatch(executeOrderWithCardRequest(nft)),
  onBuyWithCrypto: (asset: Asset, order?: Order | null) =>
    dispatch(
      openModal('BuyNFTWithCryptoModal', {
        asset,
        order
      })
    ),
  onBuyItemWithCard: item => dispatch(buyItemWithCardRequest(item))
})

export default connect(null, mapDispatch)(BuyNFTButtons)
