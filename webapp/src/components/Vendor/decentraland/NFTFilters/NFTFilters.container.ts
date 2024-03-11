import { connect } from 'react-redux'

import { RootState } from '../../../../modules/reducer'
import { clearFilters } from '../../../../modules/routing/actions'
import {
  getOnlyOnRent,
  getOnlySmart,
  hasFiltersEnabled,
  getSection,
  getSortBy,
  getOnlyOnSale,
  getIsMap,
  getRarities,
  getWearableGenders,
  getSearch,
  getContracts,
  getNetwork,
  getAssetType,
  getEmotePlayMode
} from '../../../../modules/routing/selectors'
import { getCount, getView } from '../../../../modules/ui/browse/selectors'
import { isMapSet } from '../../../../modules/routing/utils'
import { MapStateProps, MapDispatchProps, OwnProps, Props, MapDispatch } from './NFTFilters.types'
import NFTFilters from './NFTFilters'

const mapState = (state: RootState): MapStateProps => ({
  assetType: getAssetType(state),
  count: getCount(state),
  section: getSection(state),
  view: getView(state),
  sortBy: getSortBy(state),
  search: getSearch(state),
  onlyOnSale: getOnlyOnSale(state),
  onlyOnRent: getOnlyOnRent(state),
  onlySmart: getOnlySmart(state),
  isMap: isMapSet(getIsMap(state), getSection(state), getView(state)),
  rarities: getRarities(state),
  wearableGenders: getWearableGenders(state),
  contracts: getContracts(state),
  network: getNetwork(state),
  emotePlayMode: getEmotePlayMode(state),
  hasFiltersEnabled: hasFiltersEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClearFilters: () => dispatch(clearFilters())
})

const mergeProps = (stateProps: MapStateProps, dispatchProps: MapDispatchProps, ownProps: OwnProps): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
})

export default connect(mapState, mapDispatch, mergeProps)(NFTFilters)
