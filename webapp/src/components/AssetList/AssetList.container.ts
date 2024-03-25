import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { AssetType } from '../../modules/asset/types'
import { isLoadingFavoritedItems } from '../../modules/favorites/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { isLoadingNftsByView } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import { browse, clearFilters } from '../../modules/routing/actions'
import {
  getVendor,
  getPageNumber,
  getAssetType,
  getSection,
  getSearch,
  hasFiltersEnabled,
  getVisitedLocations
} from '../../modules/routing/selectors'
import { getBrowseAssets, getCount, getView } from '../../modules/ui/browse/selectors'
import AssetList from './AssetList'
import { MapStateProps, MapDispatch, MapDispatchProps } from './AssetList.types'

const mapState = (state: RootState): MapStateProps => {
  const section = getSection(state)
  const page = getPageNumber(state)
  const assetType = getAssetType(state)
  const view = getView(state)
  const loadingState = isLoadingNftsByView(state, view)
  const assets = getBrowseAssets(state, section, assetType)
  return {
    vendor: getVendor(state),
    assetType,
    section: getSection(state),
    assets,
    page,
    count: getCount(state),
    search: getSearch(state),
    isLoading:
      assetType === AssetType.ITEM
        ? isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST) || isLoadingFavoritedItems(state)
        : isLoadingType(loadingState, FETCH_NFTS_REQUEST),
    hasFiltersEnabled: hasFiltersEnabled(state),
    visitedLocations: getVisitedLocations(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options)),
  onClearFilters: () => dispatch(clearFilters())
})

export default connect(mapState, mapDispatch)(AssetList)
