import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import { MapStateProps, OwnProps } from './ItemSaleActions.types'
import { MapDispatch, MapDispatchProps } from './ItemSaleActions.types'
import ItemSaleActions from './ItemSaleActions'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  return {
    wallet
  }
}

const mapDispatch = (
  dispatch: MapDispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onBuyWithCrypto: () =>
    dispatch(
      openModal('MintNftWithCryptoModal', {
        asset: ownProps.item
      })
    )
})

export default connect(mapState, mapDispatch)(ItemSaleActions)
