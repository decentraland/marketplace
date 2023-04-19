import { getLocation } from 'connected-react-router'
import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { browse, clearFilters } from '../../modules/routing/actions'
import { getCount } from '../../modules/ui/browse/selectors'
import {
  getVendor,
  getPage,
  getCurrentBrowseOptions,
  getSection,
  getSearch,
  hasFiltersEnabled
} from '../../modules/routing/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './AssetList.types'
import AssetList from './AssetList'
import { buildBrowseURL } from '../../modules/routing/utils'
import { getLoading as getLoadingCatalog } from '../../modules/catalog/selectors'
import { FETCH_CATALOG_REQUEST } from '../../modules/catalog/actions'
import { getCatalogItems } from '../../modules/ui/browse/selectors'

const mapState = (state: RootState): MapStateProps => {
  const page = getPage(state)
  return {
    vendor: getVendor(state),
    section: getSection(state),
    page,
    count: getCount(state),
    search: getSearch(state),
    isLoading: isLoadingType(getLoadingCatalog(state), FETCH_CATALOG_REQUEST),
    urlNext: buildBrowseURL(getLocation(state).pathname, {
      ...getCurrentBrowseOptions(state),
      page: page + 1
    }),
    hasFiltersEnabled: hasFiltersEnabled(state),
    catalogItems: getCatalogItems(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options)),
  onClearFilters: () => dispatch(clearFilters())
})

export default connect(mapState, mapDispatch)(AssetList)
