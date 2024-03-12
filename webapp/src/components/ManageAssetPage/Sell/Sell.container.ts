import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'

import { MapDispatchProps, OwnProps } from './Sell.types'
import Sell from './Sell'

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
