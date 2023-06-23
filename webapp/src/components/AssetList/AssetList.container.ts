import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { browse, clearFilters } from '../../modules/routing/actions'
import { getBrowseAssets, getCount } from '../../modules/ui/browse/selectors'
import {
  getVendor,
  getPageNumber,
  getAssetType,
  getSection,
  getSearch,
  hasFiltersEnabled,
  getVisitedLocations
} from '../../modules/routing/selectors'
import { getLoading as getLoadingNFTs } from '../../modules/nft/selectors'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { AssetType } from '../../modules/asset/types'
import { MapStateProps, MapDispatch, MapDispatchProps } from './AssetList.types'
import AssetList from './AssetList'

const mapState = (state: RootState): MapStateProps => {
  const page = getPageNumber(state)
  const assetType = getAssetType(state)
  return {
    vendor: getVendor(state),
    assetType,
    section: getSection(state),
    assets: getBrowseAssets(state, assetType),
    page,
    count: getCount(state),
    search: getSearch(state),
    isLoading:
      assetType === AssetType.ITEM
        ? isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST)
        : isLoadingType(getLoadingNFTs(state), FETCH_NFTS_REQUEST),
    hasFiltersEnabled: hasFiltersEnabled(state),
    visitedLocations: getVisitedLocations(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options)),
  onClearFilters: () => dispatch(clearFilters())
})

export default connect(mapState, mapDispatch)(AssetList)
