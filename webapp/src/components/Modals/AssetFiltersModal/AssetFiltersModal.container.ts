import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { clearFilters } from '../../../modules/routing/actions'
import {
  getOnlyOnRent,
  getOnlySmart,
  hasFiltersEnabled
} from '../../../modules/routing/selectors'
import { getIsRentalsEnabled } from '../../../modules/features/selectors'
import {
  getSection,
  getSortBy,
  getOnlyOnSale,
  getRarities,
  getWearableGenders,
  getContracts,
  getNetwork,
  getAssetType,
  getEmotePlayMode
} from '../../../modules/routing/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  OwnProps,
  Props,
  MapDispatch
} from './AssetFiltersModal.types'
import AssetFiltersModal from './AssetFiltersModal'

const mapState = (state: RootState): MapStateProps => ({
  assetType: getAssetType(state),
  section: getSection(state),
  sortBy: getSortBy(state),
  onlyOnSale: getOnlyOnSale(state),
  onlyOnRent: getOnlyOnRent(state),
  onlySmart: getOnlySmart(state),
  rarities: getRarities(state),
  wearableGenders: getWearableGenders(state),
  contracts: getContracts(state),
  network: getNetwork(state),
  emotePlayMode: getEmotePlayMode(state),
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

export default connect(mapState, mapDispatch, mergeProps)(AssetFiltersModal)
