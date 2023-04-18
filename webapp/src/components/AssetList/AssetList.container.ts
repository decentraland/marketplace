import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { FETCH_FAVORITED_ITEMS_REQUEST } from '../../modules/favorites/actions'
import { browse, clearFilters } from '../../modules/routing/actions'
import {
  getNFTs,
  getCount,
  getItems,
  getItemsPickedByUser,
  getView
} from '../../modules/ui/browse/selectors'
import {
  getVendor,
  getPage,
  getAssetType,
  getSection,
  getSearch,
  hasFiltersEnabled,
  getVisitedLocations,
  getSkip
} from '../../modules/routing/selectors'
import { getLoading as getLoadingNFTs } from '../../modules/nft/selectors'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import { getLoading as getLoadingFavorites } from '../../modules/favorites/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './AssetList.types'
import AssetList from './AssetList'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { AssetType } from '../../modules/asset/types'
import { Sections } from '../../modules/routing/types'

const mapState = (state: RootState): MapStateProps => {
  const section = getSection(state)
  const page = getPage(state)
  const assetType = getAssetType(state)
  console.log('Items picked by user', getItemsPickedByUser(state))
  console.log('Count', getCount(state))
  console.log('View', getView(state))
  return {
    vendor: getVendor(state),
    assetType,
    section,
    nfts: getNFTs(state),
    items:
      section === Sections.decentraland.LISTS
        ? getItemsPickedByUser(state)
        : getItems(state),
    page,
    skip: getSkip(state),
    count: getCount(state),
    search: getSearch(state),
    isLoading:
      assetType === AssetType.ITEM
        ? isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST) ||
          isLoadingType(
            getLoadingFavorites(state),
            FETCH_FAVORITED_ITEMS_REQUEST
          )
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
