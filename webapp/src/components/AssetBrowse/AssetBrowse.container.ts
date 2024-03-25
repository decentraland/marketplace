import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { browse, fetchAssetsFromRoute } from '../../modules/routing/actions'
import {
  getIsMap,
  getOnlyOnSale,
  getAssetType,
  getSection,
  getOnlySmart,
  getOnlyOnRent,
  getIsFullscreen,
  getVisitedLocations
} from '../../modules/routing/selectors'
import { isMapSet } from '../../modules/routing/utils'
import { setView } from '../../modules/ui/actions'
import { getView } from '../../modules/ui/browse/selectors'
import AssetBrowse from './AssetBrowse'
import { MapDispatch, MapDispatchProps, MapStateProps, OwnProps, Props } from './AssetBrowse.types'

const mapState = (state: RootState): MapStateProps => {
  const isMap = isMapSet(getIsMap(state), getSection(state), getView(state))

  return {
    isMap,
    isFullscreen: getIsFullscreen(state) ?? isMap,
    onlyOnSale: getOnlyOnSale(state),
    section: getSection(state),
    assetType: getAssetType(state),
    viewInState: getView(state),
    onlySmart: getOnlySmart(state),
    onlyOnRent: getOnlyOnRent(state),
    visitedLocations: getVisitedLocations(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetView: view => dispatch(setView(view)),
  onFetchAssetsFromRoute: options => dispatch(fetchAssetsFromRoute(options)),
  onBrowse: options => dispatch(browse(options))
})

const mergeProps = (stateProps: MapStateProps, dispatchProps: MapDispatchProps, ownProps: OwnProps): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  section: ownProps.section ?? stateProps.section,
  isMap: stateProps.isMap ?? ownProps.isMap
})

export default connect(mapState, mapDispatch, mergeProps)(AssetBrowse)
