import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Order } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../../modules/nft/types'
import { CANCEL_ORDER_REQUEST, cancelOrderRequest } from '../../../modules/order/actions'
import { getLoading as getLoadingOrders } from '../../../modules/order/selectors'
import { RootState } from '../../../modules/reducer'
import Sell from './Sell'
import { MapDispatchProps, MapStateProps, OwnProps } from './Sell.types'

const mapState = (state: RootState): MapStateProps => ({
  isLoadingCancelOrder: isLoadingType(getLoadingOrders(state), CANCEL_ORDER_REQUEST)
})

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps => ({
  onCancelOrder: (order: Order, nft: NFT) => dispatch(cancelOrderRequest(order, nft, true)),
  // TODO: @Rentals, add the mapDispatch that opens the sell modal once implemented
  onEditOrder: () =>
    dispatch(
      openModal('SellModal', {
        nft: ownProps.nft,
        order: ownProps.order
      })
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
