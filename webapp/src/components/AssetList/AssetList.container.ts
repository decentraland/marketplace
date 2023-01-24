import { getLocation } from 'connected-react-router'
import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { browse, clearFilters } from '../../modules/routing/actions'
import { getNFTs, getCount, getItems } from '../../modules/ui/browse/selectors'
import {
  getVendor,
  getPage,
  getAssetType,
  getCurrentBrowseOptions,
  getSection,
  getSearch,
  hasFiltersEnabled
} from '../../modules/routing/selectors'
import { getLoading as getLoadingNFTs } from '../../modules/nft/selectors'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './AssetList.types'
import AssetList from './AssetList'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { buildBrowseURL } from '../../modules/routing/utils'
import { AssetType } from '../../modules/asset/types'

const mapState = (state: RootState): MapStateProps => {
  const page = getPage(state)
  const assetType = getAssetType(state)
  return {
    vendor: getVendor(state),
    assetType,
    section: getSection(state),
    nfts: getNFTs(state),
    items: getItems(state),
    page,
    count: getCount(state),
    search: getSearch(state),
    isLoading:
      assetType === AssetType.ITEM
        ? isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST)
        : isLoadingType(getLoadingNFTs(state), FETCH_NFTS_REQUEST),
    urlNext: buildBrowseURL(getLocation(state).pathname, {
      ...getCurrentBrowseOptions(state),
      page: page + 1
    }),
    hasFiltersEnabled: hasFiltersEnabled(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options)),
  onClearFilters: () => dispatch(clearFilters())
})

export default connect(mapState, mapDispatch)(AssetList)
