import { Item } from '@dcl/schemas'
import { Dispatch, bindActionCreators } from 'redux'
import { Route } from 'decentraland-transactions/crossChain'
import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import {
  buyItemCrossChainRequest,
  buyItemRequest,
  buyItemWithCardRequest
} from '../../../../modules/item/actions'
import { getContract } from '../../../../modules/contract/selectors'
import { Contract } from '../../../../modules/vendor/services'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './MintNftWithCryptoModal.types'
import { MintNftWithCryptoModal } from './MintNftWithCryptoModal'

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
      onBuyItem: buyItemRequest,
      onBuyItemCrossChain: (route: Route) =>
        buyItemCrossChainRequest(ownProps.metadata.item as Item, route),
      onBuyWithCard: buyItemWithCardRequest
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(MintNftWithCryptoModal)
