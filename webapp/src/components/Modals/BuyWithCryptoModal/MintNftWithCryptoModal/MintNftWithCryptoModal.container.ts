import { Dispatch, bindActionCreators } from 'redux'
import { Route } from 'decentraland-transactions/crossChain'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading'
import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import {
  BUY_ITEM_CROSS_CHAIN_REQUEST,
  BUY_ITEM_REQUEST,
  buyItemCrossChainRequest,
  buyItemRequest,
  buyItemWithCardRequest
} from '../../../../modules/item/actions'
import { getContract } from '../../../../modules/contract/selectors'
import { Contract } from '../../../../modules/vendor/services'
import { getLoading as getItemsLoading } from '../../../../modules/item/selectors'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './MintNftWithCryptoModal.types'
import { MintNftWithCryptoModal } from './MintNftWithCryptoModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isBuyingItemNatively: isLoadingType(
      getItemsLoading(state),
      BUY_ITEM_REQUEST
    ),
    isBuyingItemCrossChain: isLoadingType(
      getItemsLoading(state),
      BUY_ITEM_CROSS_CHAIN_REQUEST
    ),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps =>
  bindActionCreators(
    {
      onBuyItem: buyItemRequest,
      onBuyItemCrossChain: (route: Route) =>
        buyItemCrossChainRequest(ownProps.metadata.item, route),
      onBuyWithCard: buyItemWithCardRequest
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(MintNftWithCryptoModal)
