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
import { getLoading as getLoadingOrders } from '../../../modules/order/selectors'
import { EXECUTE_ORDER_REQUEST } from '../../../modules/order/actions'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import { getLoading as getItemsLoading } from '../../../modules/item/selectors'
import {
  BUY_ITEM_CROSS_CHAIN_REQUEST,
  BUY_ITEM_REQUEST
} from '../../../modules/item/actions'
import { MapDispatchProps, MapStateProps } from './BuyWithCryptoModal.types'
import { BuyWithCryptoModal } from './BuyWithCryptoModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    isLoading:
      isLoadingType(
        getLoadingAuthorizations(state),
        FETCH_AUTHORIZATIONS_REQUEST
      ) ||
      isLoadingType(getLoadingOrders(state), EXECUTE_ORDER_REQUEST) ||
      isLoadingType(getItemsLoading(state), BUY_ITEM_REQUEST),
    isLoadingBuyCrossChain: isLoadingType(
      getItemsLoading(state),
      BUY_ITEM_CROSS_CHAIN_REQUEST
    ),
    isSwitchingNetwork: isSwitchingNetwork(state),
    isBuyWithCardPage: getIsBuyWithCardPage(state)
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onGetMana: () => dispatch(openBuyManaWithFiatModalRequest(Network.MATIC)),
  onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId))
})

export default connect(mapState, mapDispatch)(BuyWithCryptoModal)
