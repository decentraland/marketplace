import { connect } from 'react-redux'

import { RootState } from '../../../../modules/reducer'
import { clearFilters } from '../../../../modules/routing/actions'
import {
  getOnlySmart,
  hasFiltersEnabled
} from '../../../../modules/routing/selectors'
import { getCount } from '../../../../modules/ui/browse/selectors'
import {
  getSection,
  getSortBy,
  getOnlyOnSale,
  getIsMap,
  getWearableRarities,
  getWearableGenders,
  getSearch,
  getContracts,
  getNetwork,
  getAssetType
} from '../../../../modules/routing/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  OwnProps,
  Props,
  MapDispatch
} from './NFTFilters.types'
import NFTFilters from './NFTFilters'

const mapState = (state: RootState): MapStateProps => ({
  assetType: getAssetType(state),
  count: getCount(state),
  section: getSection(state),
  sortBy: getSortBy(state),
  search: getSearch(state),
  onlyOnSale: getOnlyOnSale(state),
  onlySmart: getOnlySmart(state),
  isMap: getIsMap(state),
  wearableRarities: getWearableRarities(state),
  wearableGenders: getWearableGenders(state),
  contracts: getContracts(state),
  network: getNetwork(state),
  hasFiltersEnabled: hasFiltersEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClearFilters: () => dispatch(clearFilters())
})

const mergeProps = (
  stateProps: MapStateProps,
  dispatchProps: MapDispatchProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
})

export default connect(mapState, mapDispatch, mergeProps)(NFTFilters)
