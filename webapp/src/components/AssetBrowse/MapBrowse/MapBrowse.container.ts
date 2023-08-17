import { connect } from 'react-redux'
import { getIsMapViewFiltersEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import {
  getOnlyOnRent,
  getOnlyOnSale
} from '../../../modules/routing/selectors'
import { getTiles } from '../../../modules/tile/selectors'
import { getWalletOwnedLands } from '../../../modules/ui/browse/selectors'
import { MapBrowse } from './MapBrowse'
import { MapStateProps, MapDispatch, MapDispatchProps } from './MapBrowse.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    tiles: getTiles(state),
    ownedLands: getWalletOwnedLands(state),
    onlyOnSale: getOnlyOnSale(state),
    onlyOnRent: getOnlyOnRent(state),
    isMapViewFiltersEnabled: getIsMapViewFiltersEnabled(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: (options) => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(MapBrowse)
