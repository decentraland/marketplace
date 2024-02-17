import type { Item } from '@dcl/schemas'
import { Dispatch, bindActionCreators } from 'redux'
import type { Route } from 'decentraland-transactions/crossChain'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading'
import { connect } from 'react-redux'
import type { RootState } from '../../../../modules/reducer'
import { BUY_ITEM_CROSS_CHAIN_REQUEST, buyItemCrossChainRequest } from '../../../../modules/item/actions'
import { getContract } from '../../../../modules/contract/selectors'
import { getLoading as getItemsLoading } from '../../../../modules/item/selectors'
import { getLoading as getLoadingOrders } from '../../../../modules/order/selectors'
import type { Contract } from '../../../../modules/vendor/services'
import {
  EXECUTE_ORDER_REQUEST,
  executeOrderRequest,
  executeOrderWithCardRequest
} from '../../../../modules/order/actions'
import type {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './BuyNftWithCryptoModal.types'
import { BuyNftWithCryptoModal } from './BuyNftWithCryptoModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isExecutingOrder: isLoadingType(getLoadingOrders(state), EXECUTE_ORDER_REQUEST),
    isExecutingOrderCrossChain: isLoadingType(getItemsLoading(state), BUY_ITEM_CROSS_CHAIN_REQUEST),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps =>
  bindActionCreators(
    {
      onExecuteOrder: executeOrderRequest,
      onExecuteOrderCrossChain: (route: Route) =>
        buyItemCrossChainRequest(
          (ownProps.metadata.nft as unknown) as Item,
          route
        ),
      onExecuteOrderWithCard: executeOrderWithCardRequest
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(BuyNftWithCryptoModal)
