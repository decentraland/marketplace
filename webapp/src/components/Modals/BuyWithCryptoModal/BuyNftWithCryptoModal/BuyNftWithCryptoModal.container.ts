import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import type { Item, Order } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading'
import { getData as getWallet } from 'decentraland-dapps/dist/modules/wallet/selectors'
import type { Route } from 'decentraland-transactions/crossChain'
import { getContract } from '../../../../modules/contract/selectors'
import { getIsOffchainPublicNFTOrdersEnabled } from '../../../../modules/features/selectors'
import { BUY_ITEM_CROSS_CHAIN_REQUEST, buyItemCrossChainRequest } from '../../../../modules/item/actions'
import { getLoading as getItemsLoading } from '../../../../modules/item/selectors'
import { NFT } from '../../../../modules/nft/types'
import { EXECUTE_ORDER_REQUEST, executeOrderRequest, executeOrderWithCardRequest } from '../../../../modules/order/actions'
import { getLoading as getLoadingOrders } from '../../../../modules/order/selectors'
import type { RootState } from '../../../../modules/reducer'
import type { Contract } from '../../../../modules/vendor/services'
import { BuyNftWithCryptoModal } from './BuyNftWithCryptoModal'
import type { MapDispatchProps, MapStateProps, OwnProps } from './BuyNftWithCryptoModal.types'
const mapState = (state: RootState): MapStateProps => {
  return {
    connectedChainId: getWallet(state)?.chainId,
    isExecutingOrder: isLoadingType(getLoadingOrders(state), EXECUTE_ORDER_REQUEST),
    isExecutingOrderCrossChain: isLoadingType(getItemsLoading(state), BUY_ITEM_CROSS_CHAIN_REQUEST),
    isOffchainPublicNFTOrdersEnabled: getIsOffchainPublicNFTOrdersEnabled(state),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps =>
  bindActionCreators(
    {
      onExecuteOrder: (order: Order, nft: NFT, fingerprint?: string, silent?: boolean, useCredits?: boolean) =>
        executeOrderRequest(order, nft, fingerprint, silent, useCredits),
      onExecuteOrderCrossChain: (route: Route) =>
        buyItemCrossChainRequest(ownProps.metadata.nft as unknown as Item, route, ownProps.metadata.order),
      onExecuteOrderWithCard: executeOrderWithCardRequest
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(BuyNftWithCryptoModal)
