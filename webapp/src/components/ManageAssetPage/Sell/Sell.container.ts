import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import Sell from './Sell'
import { MapDispatchProps, OwnProps } from './Sell.types'

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps => ({
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

export default connect(undefined, mapDispatch)(Sell)
