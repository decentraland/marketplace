import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import {
  getAssetType,
  getCurrentBrowseOptions,
  hasFiltersEnabled
} from '../../../modules/routing/selectors'
import { BrowseOptions } from '../../../modules/routing/types'
import { getView } from '../../../modules/ui/browse/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './AssetFiltersModal.types'
import AssetFiltersModal from './AssetFiltersModal'

const mapState = (state: RootState): MapStateProps => ({
  view: getView(state),
  assetType: getAssetType(state),
  hasFiltersEnabled: hasFiltersEnabled(state),
  browseOptions: getCurrentBrowseOptions(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: (options: BrowseOptions) => dispatch(browse(options)),
})

export default connect(mapState, mapDispatch)(AssetFiltersModal)
