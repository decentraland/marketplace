import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { RootState } from '../../modules/reducer'
import { getCount, getView } from '../../modules/ui/browse/selectors'
import {
  getAssetType,
  getIsMap,
  getOnlyOnRent,
  getOnlyOnSale,
  getSearch,
  getSection,
  getSortBy,
  hasFiltersEnabled
} from '../../modules/routing/selectors'
import { BrowseOptions } from '../../modules/routing/types'
import { isMapSet } from '../../modules/routing/utils'
import { browse, clearFilters } from '../../modules/routing/actions'
import { MapStateProps, MapDispatchProps } from './AssetTopbar.types'
import { AssetTopbar } from './AssetTopbar'

const mapState = (state: RootState): MapStateProps => {
  const view = getView(state)
  return {
    count: getCount(state),
    search: getSearch(state),
    isMap: isMapSet(getIsMap(state), getSection(state), view),
    view,
    onlyOnRent: getOnlyOnRent(state),
    onlyOnSale: getOnlyOnSale(state),
    sortBy: getSortBy(state),
    assetType: getAssetType(state),
    section: getSection(state),
    hasFiltersEnabled: hasFiltersEnabled(state)
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBrowse: (options: BrowseOptions) => dispatch(browse(options)),
  onClearFilters: () => dispatch(clearFilters()),
  onOpenFiltersModal: () => dispatch(openModal('AssetFiltersModal'))
})

export default connect(mapState, mapDispatch)(AssetTopbar)
