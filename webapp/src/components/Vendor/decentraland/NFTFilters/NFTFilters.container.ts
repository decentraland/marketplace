import { connect } from 'react-redux'

import { RootState } from '../../../../modules/reducer'
import { clearFilters } from '../../../../modules/routing/actions'
import {
  getOnlyOnRent,
  getOnlySmart,
  hasFiltersEnabled
} from '../../../../modules/routing/selectors'
import { getCount } from '../../../../modules/ui/browse/selectors'
import { getIsRentalsEnabled } from '../../../../modules/features/selectors'
import {
  getSection,
  getSortBy,
  getOnlyOnSale,
  getIsMap,
  getRarities,
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
  onlyOnRent: getOnlyOnRent(state),
  onlySmart: getOnlySmart(state),
  isMap: getIsMap(state),
  rarities: getRarities(state),
  wearableGenders: getWearableGenders(state),
  contracts: getContracts(state),
  network: getNetwork(state),
  hasFiltersEnabled: hasFiltersEnabled(state),
  isRentalsEnabled: getIsRentalsEnabled(state)
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
