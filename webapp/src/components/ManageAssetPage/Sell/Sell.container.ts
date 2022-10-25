import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { locations } from '../../../modules/routing/locations'
import { RootState } from '../../../modules/reducer'
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
    )
})

export default connect(mapState, mapDispatch)(Sell)
