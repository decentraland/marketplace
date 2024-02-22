import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Network } from '@dcl/schemas'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { getLoading as getLoadingAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import { isSwitchingNetwork } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './BuyWithCryptoModal.types'
import { BuyWithCryptoModal } from './BuyWithCryptoModal'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  return {
    wallet: getWallet(state),
    isLoading:
      isLoadingType(
        getLoadingAuthorizations(state),
        FETCH_AUTHORIZATIONS_REQUEST
      ) || ownProps.isBuyingAsset,
    isSwitchingNetwork: isSwitchingNetwork(state),
    isBuyWithCardPage: getIsBuyWithCardPage(state)
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onGetMana: () => dispatch(openBuyManaWithFiatModalRequest(Network.MATIC)),
  onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId))
})

export default connect(mapState, mapDispatch)(BuyWithCryptoModal)
