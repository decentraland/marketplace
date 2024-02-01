import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Item, Network } from '@dcl/schemas'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { getLoading as getLoadingAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import type { Route } from 'decentraland-transactions/crossChain'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import { isSwitchingNetwork } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { getLoading as getLoadingOrders } from '../../../modules/order/selectors'
import {
  EXECUTE_ORDER_REQUEST,
  executeOrderRequest,
  executeOrderWithCardRequest
} from '../../../modules/order/actions'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import { getLoading as getItemsLoading } from '../../../modules/item/selectors'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import {
  BUY_ITEM_CROSS_CHAIN_REQUEST,
  BUY_ITEM_REQUEST,
  buyItemCrossChainRequest,
  buyItemRequest,
  buyItemWithCardRequest
} from '../../../modules/item/actions'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './BuyWithCryptoModal.types'
import {
  BuyNFTWithCryptoModal,
  MintNFTWithCryptoModal
} from './BuyWithCryptoModal'

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
    isBuyWithCardPage: getIsBuyWithCardPage(state),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onGetMana: () => dispatch(openBuyManaWithFiatModalRequest(Network.MATIC)),
  onBuyItemThroughProvider: (route: Route) =>
    dispatch(buyItemCrossChainRequest(ownProps.metadata.asset as Item, route)),
  onSwitchNetwork: chainId => dispatch(switchNetworkRequest(chainId)),
  onBuyItem: item => dispatch(buyItemRequest(item)),
  onExecuteOrder: (order, nft, fingerprint, silent) =>
    dispatch(executeOrderRequest(order, nft, fingerprint, silent)),
  onExecuteOrderWithCard: nft => dispatch(executeOrderWithCardRequest(nft)),
  onBuyItemWithCard: item => dispatch(buyItemWithCardRequest(item))
})

export const BuyNFTWithCryptoModalContainer = connect(
  mapState,
  mapDispatch
)(BuyNFTWithCryptoModal)

export const MintNFTWithCryptoModalConatiner = connect(
  mapState,
  mapDispatch
)(MintNFTWithCryptoModal)
