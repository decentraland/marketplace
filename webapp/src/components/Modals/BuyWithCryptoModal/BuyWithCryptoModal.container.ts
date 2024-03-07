import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Network } from '@dcl/schemas'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { isSwitchingNetwork } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import { MapDispatchProps, MapStateProps } from './BuyWithCryptoModal.types'
import { BuyWithCryptoModal } from './BuyWithCryptoModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    isSwitchingNetwork: isSwitchingNetwork(state),
    isBuyWithCardPage: getIsBuyWithCardPage(state)
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onGetMana: () => dispatch(openBuyManaWithFiatModalRequest(Network.MATIC)),
  onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId))
})

export default connect(mapState, mapDispatch)(BuyWithCryptoModal)
