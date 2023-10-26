import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { getLoading as getLoadingAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { Contract } from '../../../modules/vendor/services'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { getLoading as getLoadingOrders } from '../../../modules/order/selectors'
import {
  EXECUTE_ORDER_REQUEST,
  executeOrderRequest,
  executeOrderWithCardRequest
} from '../../../modules/order/actions'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import {
  buyItemCrossChainRequest,
  buyItemRequest,
  buyItemWithCardRequest
} from '../../../modules/item/actions'
import { Route } from '../../../lib/xchain'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './BuyWithCryptoModal.types'
import BuyWithCryptoModal from './BuyWithCryptoModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    order: getCurrentOrder(state),
    isLoading:
      isLoadingType(
        getLoadingAuthorizations(state),
        FETCH_AUTHORIZATIONS_REQUEST
      ) || isLoadingType(getLoadingOrders(state), EXECUTE_ORDER_REQUEST),
    isBuyWithCardPage: getIsBuyWithCardPage(state),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onBuyItemThroughProvider: (route: Route) =>
    dispatch(buyItemCrossChainRequest(ownProps.asset as Item, route)),
  onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId)),
  onBuyItem: item => dispatch(buyItemRequest(item)),
  onExecuteOrder: (order, nft, fingerprint, silent) =>
    dispatch(executeOrderRequest(order, nft, fingerprint, silent)),
  onExecuteOrderWithCard: nft => dispatch(executeOrderWithCardRequest(nft)),
  onBuyItemWithCard: item => dispatch(buyItemWithCardRequest(item))
})

export default connect(mapState, mapDispatch)(BuyWithCryptoModal)
