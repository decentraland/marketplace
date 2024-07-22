import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { Asset } from '../../../../modules/asset/types'
import { fetchBidsByAssetRequest } from '../../../../modules/bid/actions'
import { getIsBidsOffChainEnabled } from '../../../../modules/features/selectors'
import { RootState } from '../../../../modules/reducer'
import { getAssetBids } from '../../../../modules/ui/asset/bid/selectors'
import { getWallet } from '../../../../modules/wallet/selectors'
import ItemSaleActions from './ItemSaleActions'
import { MapStateProps, OwnProps, MapDispatch, MapDispatchProps } from './ItemSaleActions.types'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  return {
    wallet,
    isBidsOffchainEnabled: getIsBidsOffChainEnabled(state),
    bids: getAssetBids(state)
  }
}

const mapDispatch = (dispatch: MapDispatch, ownProps: OwnProps): MapDispatchProps => ({
  onFetchBids: (asset: Asset) => dispatch(fetchBidsByAssetRequest(asset)),
  onBuyWithCrypto: () =>
    dispatch(
      openModal('MintNftWithCryptoModal', {
        asset: ownProps.item
      })
    )
})

export default connect(mapState, mapDispatch)(ItemSaleActions)
