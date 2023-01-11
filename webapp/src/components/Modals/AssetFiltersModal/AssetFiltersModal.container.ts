import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { browse, clearFilters } from '../../../modules/routing/actions'
import {
  hasFiltersEnabled
} from '../../../modules/routing/selectors'
import { BrowseOptions } from '../../../modules/routing/types'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './AssetFiltersModal.types'
import AssetFiltersModal from './AssetFiltersModal'

const mapState = (state: RootState): MapStateProps => ({
  hasFiltersEnabled: hasFiltersEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClearFilters: () => dispatch(clearFilters()),
  onBrowse: (options: BrowseOptions) => dispatch(browse(options)),
})

export default connect(mapState, mapDispatch)(AssetFiltersModal)
