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
import { getListIdFromCurrentUrlPath, useGetBrowseOptions } from '../../modules/routing/hooks'
import { hasFiltersEnabled } from '../../modules/routing/url-parser'
import { getBrowseAssets, getCount, getView } from '../../modules/ui/browse/selectors'
import AssetList from './AssetList'
import { ContainerProps } from './AssetList.types'

const AssetListContainer: React.FC<ContainerProps> = ({ isManager }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const browseOptions = useGetBrowseOptions()
  const { search, section, assetType, vendor, page } = browseOptions

  const count = useSelector(getCount)
  const view = useSelector(getView)

  const hasFiltersEnabledValue = useMemo(() => hasFiltersEnabled(browseOptions), [browseOptions])
  const listId = useMemo(() => getListIdFromCurrentUrlPath(location.pathname), [location.pathname])
  const assets = useSelector((state: RootState) => getBrowseAssets(state, section, assetType, listId))

  const loadingState = useSelector((state: RootState) => isLoadingNftsByView(state, view))
  const isLoading = useSelector((state: RootState) =>
    browseOptions.assetType === AssetType.ITEM
      ? isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST) || isLoadingFavoritedItems(state)
      : isLoadingType(loadingState, FETCH_NFTS_REQUEST)
  )

  const handleBrowse = useCallback<ActionFunction<typeof browse>>(options => dispatch(browse(options)), [dispatch])
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
