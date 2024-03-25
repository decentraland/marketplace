import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading'
import type { Route } from 'decentraland-transactions/crossChain'
import { getContract } from '../../../../modules/contract/selectors'
import {
  BUY_ITEM_CROSS_CHAIN_REQUEST,
  BUY_ITEM_REQUEST,
  buyItemCrossChainRequest,
  buyItemRequest,
  buyItemWithCardRequest
} from '../../../../modules/item/actions'
import { getLoading as getItemsLoading } from '../../../../modules/item/selectors'
import { RootState } from '../../../../modules/reducer'
import { Contract } from '../../../../modules/vendor/services'
import { MintNftWithCryptoModal } from './MintNftWithCryptoModal'
import { MapDispatchProps, MapStateProps, OwnProps } from './MintNftWithCryptoModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isBuyingItemNatively: isLoadingType(getItemsLoading(state), BUY_ITEM_REQUEST),
    isBuyingItemCrossChain: isLoadingType(getItemsLoading(state), BUY_ITEM_CROSS_CHAIN_REQUEST),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps =>
  bindActionCreators(
    {
      onBuyItem: buyItemRequest,
      onBuyItemCrossChain: (route: Route) => buyItemCrossChainRequest(ownProps.metadata.item, route),
      onBuyWithCard: buyItemWithCardRequest
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(MintNftWithCryptoModal)
