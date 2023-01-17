import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Order } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'

import { locations } from '../../../modules/routing/locations'
import { RootState } from '../../../modules/reducer'
import { NFT } from '../../../modules/nft/types'

import { MapDispatchProps, MapStateProps, OwnProps } from './Sell.types'
import Sell from './Sell'

const mapState = (_state: RootState): MapStateProps => ({})

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

  onListForSale: (nft: NFT, order: Order | null) =>
    dispatch(
      openModal('SellModal', {
        nft,
        order
      })
    )
})

export default connect(mapState, mapDispatch)(Sell)
