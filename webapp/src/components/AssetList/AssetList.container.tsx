import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { AssetType } from '../../modules/asset/types'
import { isLoadingFavoritedItems } from '../../modules/favorites/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { isLoadingNftsByView } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import { browse, clearFilters } from '../../modules/routing/actions'
import { getListIdFromCurrentUrlPath } from '../../modules/routing/hooks'
import { getVendor, getPageNumber, getAssetType, getSection, getSearch, hasFiltersEnabled } from '../../modules/routing/selectors'
import { getBrowseAssets, getCount, getView } from '../../modules/ui/browse/selectors'
import AssetList from './AssetList'
import { Props } from './AssetList.types'

type ContainerProps = Pick<Props, 'isManager'>

const AssetListContainer: React.FC<ContainerProps> = ({ isManager }) => {
  const dispatch = useDispatch()
  const location = useLocation()

  // Get state from Redux store using useSelector
  const vendor = useSelector(getVendor)
  const section = useSelector(getSection)
  const assetType = useSelector(getAssetType)
  const page = useSelector(getPageNumber)
  const count = useSelector(getCount)
  const search = useSelector(getSearch)
  const hasFiltersEnabledValue = useSelector(hasFiltersEnabled)
  const view = useSelector(getView)

  // Get listId from current URL path
  const listId = useMemo(() => getListIdFromCurrentUrlPath(location.pathname), [location.pathname])

  // Get assets with all required parameters
  const assets = useSelector((state: RootState) => getBrowseAssets(state, section, assetType, listId))

  // Get loading states
  const loadingState = useSelector((state: RootState) => isLoadingNftsByView(state, view))
  const isLoading = useSelector((state: RootState) =>
    assetType === AssetType.ITEM
      ? isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST) || isLoadingFavoritedItems(state)
      : isLoadingType(loadingState, FETCH_NFTS_REQUEST)
  )

  // Create dispatch handlers
  const handleBrowse = useCallback((options: Parameters<typeof browse>[0]) => dispatch(browse(options)), [dispatch])
  const handleClearFilters = useCallback(() => dispatch(clearFilters()), [dispatch])

  return (
    <AssetList
      vendor={vendor}
      assetType={assetType}
      section={section}
      assets={assets}
      page={page}
      count={count}
      search={search}
      isLoading={isLoading}
      hasFiltersEnabled={hasFiltersEnabledValue}
      onBrowse={handleBrowse}
      onClearFilters={handleClearFilters}
      isManager={isManager}
    />
  )
}

export default AssetListContainer
