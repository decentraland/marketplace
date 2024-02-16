import type { Item } from '@dcl/schemas'
import { Dispatch, bindActionCreators } from 'redux'
import type { Route } from 'decentraland-transactions/crossChain'
import { connect } from 'react-redux'
import type { RootState } from '../../../../modules/reducer'
import { buyItemCrossChainRequest } from '../../../../modules/item/actions'
import { getContract } from '../../../../modules/contract/selectors'
import type { Contract } from '../../../../modules/vendor/services'
import {
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
