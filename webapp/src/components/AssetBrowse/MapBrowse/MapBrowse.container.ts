import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getOnlyOnRent, getOnlyOnSale } from '../../../modules/routing/selectors'
import { browse } from '../../../modules/routing/actions'
import { getTiles } from '../../../modules/tile/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './MapBrowse.types'
import { MapBrowse } from './MapBrowse'
import { getWalletOwnedLands } from '../../../modules/ui/browse/selectors'

const mapState = (state: RootState): MapStateProps => {
  return {
    tiles: getTiles(state),
    ownedLands: getWalletOwnedLands(state),
    onlyOnSale: getOnlyOnSale(state),
    onlyOnRent: getOnlyOnRent(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(MapBrowse)
