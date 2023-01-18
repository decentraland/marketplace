import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Contract } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'

import { locations } from '../../../modules/routing/locations'
import { RootState } from '../../../modules/reducer'

import { MapDispatchProps, MapStateProps, OwnProps } from './Sell.types'
import Sell from './Sell'
import { getWallet } from '../../../modules/wallet/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading as getLoadingOrders } from '../../../modules/order/selectors'
import { CREATE_ORDER_REQUEST } from '../../../modules/order/actions'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    getContract: (query: Partial<Contract>) => getContract(state, query),
    isCreatingOrder: isLoadingType(
      getLoadingOrders(state),
      CREATE_ORDER_REQUEST
    )
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  // TODO: @Rentals, add the mapDispatch that opens the sell modal once implemented
  onEditOrder: () =>
    dispatch(
      push(locations.sell(ownProps.nft.contractAddress, ownProps.nft.tokenId))
    ),

  onCancelOrder: () =>
    dispatch(
      push(locations.cancel(ownProps.nft.contractAddress, ownProps.nft.tokenId))
    ),

  onListForSale: () =>
    dispatch(
      openModal('SellModal', {
        nft: ownProps.nft,
        order: ownProps.order
      })
    )
})

export default connect(mapState, mapDispatch)(Sell)
