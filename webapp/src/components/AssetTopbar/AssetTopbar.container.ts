import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { AssetType } from '../../modules/asset/types'
import { isLoadingFavoritedItems } from '../../modules/favorites/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { getLoading as getLoadingNFTs } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import { browse, clearFilters } from '../../modules/routing/actions'
import {
  getAssetType,
  getIsMap,
  getOnlyOnRent,
  getOnlyOnSale,
  getSearch,
  getSection,
  getSortBy,
  getSortByOptions,
  hasFiltersEnabled
} from '../../modules/routing/selectors'
import { BrowseOptions } from '../../modules/routing/types'
import { isMapSet } from '../../modules/routing/utils'
import { getCount, getView } from '../../modules/ui/browse/selectors'
import { AssetTopbar } from './AssetTopbar'
import { MapStateProps, MapDispatchProps } from './AssetTopbar.types'

const mapState = (state: RootState): MapStateProps => {
  const view = getView(state)
  const assetType = getAssetType(state)
  return {
    count: getCount(state),
    search: getSearch(state),
    isMap: isMapSet(getIsMap(state), getSection(state), view),
    view,
    onlyOnRent: getOnlyOnRent(state),
    onlyOnSale: getOnlyOnSale(state),
    sortBy: getSortBy(state),
    sortByOptions: getSortByOptions(state),
    assetType: getAssetType(state),
    section: getSection(state),
    hasFiltersEnabled: hasFiltersEnabled(state),
    isLoading:
      assetType === AssetType.ITEM
        ? isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST) || isLoadingFavoritedItems(state)
        : isLoadingType(getLoadingNFTs(state), FETCH_NFTS_REQUEST)
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBrowse: (options: BrowseOptions) => dispatch(browse(options)),
  onClearFilters: () => dispatch(clearFilters()),
  onOpenFiltersModal: () => dispatch(openModal('AssetFiltersModal'))
})

export default connect(mapState, mapDispatch)(AssetTopbar)
