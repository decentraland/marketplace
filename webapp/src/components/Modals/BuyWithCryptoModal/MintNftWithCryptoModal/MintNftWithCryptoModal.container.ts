import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { Item } from '@dcl/schemas'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading'
import { getData as getWallet } from 'decentraland-dapps/dist/modules/wallet/selectors'
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
  const wallet = getWallet(state)
  return {
    credits: wallet?.address ? getCredits(state, wallet.address) : null,
    connectedChainId: wallet?.chainId,
    isBuyingItemNatively: isLoadingType(getItemsLoading(state), BUY_ITEM_REQUEST),
    isBuyingItemCrossChain: isLoadingType(getItemsLoading(state), BUY_ITEM_CROSS_CHAIN_REQUEST),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps =>
  bindActionCreators(
    {
      onBuyItem: (item: Item, useCredits: boolean = false) => buyItemRequest(item, useCredits),
      onBuyItemCrossChain: (route: Route) => buyItemCrossChainRequest(ownProps.metadata.item, route),
      onBuyWithCard: buyItemWithCardRequest
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(MintNftWithCryptoModal)
