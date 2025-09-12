import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { AssetType } from '../../modules/asset/types'
import { isLoadingFavoritedItems } from '../../modules/favorites/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import { isLoadingNfts } from '../../modules/nft/selectors'
import { browse, clearFilters } from '../../modules/routing/actions'
import { useGetBrowseOptions, useGetSortByOptionsFromCurrentUrl } from '../../modules/routing/hooks'
import { hasFiltersEnabled } from '../../modules/routing/url-parser'
import { getCount, getView } from '../../modules/ui/browse/selectors'
import { AssetTopbar } from './AssetTopbar'
import { ContainerProps } from './AssetTopbar.types'

const AssetTopbarContainer: React.FC<ContainerProps> = props => {
  const dispatch = useDispatch()
  const browseOptions = useGetBrowseOptions()
  const sortByOptions = useGetSortByOptionsFromCurrentUrl()
  const filtersEnabled = useMemo(() => hasFiltersEnabled(browseOptions), [browseOptions])
  const { search, isMap, assetType, onlyOnRent, onlyOnSale, sortBy, section } = browseOptions

  const count = useSelector(getCount)
  const view = useSelector(getView)
  const loadingItems = useSelector(getLoadingItems)
  const loadingNFTs = useSelector(isLoadingNfts)
  const loadingFavoritedItems = useSelector(isLoadingFavoritedItems)

  const isLoading = useMemo(
    () => (assetType === AssetType.ITEM ? isLoadingType(loadingItems, FETCH_ITEMS_REQUEST) || loadingFavoritedItems : loadingNFTs),
    [assetType, loadingItems, loadingFavoritedItems, loadingNFTs]
  )

  const handleBrowse = useCallback<ActionFunction<typeof browse>>(options => dispatch(browse(options)), [dispatch])
  const handleClearFilters = useCallback<ActionFunction<typeof clearFilters>>(() => dispatch(clearFilters()), [dispatch])
  const handleOpenFiltersModal = useCallback(() => {
    dispatch(openModal('AssetFiltersModal'))
  }, [dispatch])

  return (
    <AssetTopbar
      disableSearchDropdown={props.disableSearchDropdown}
      search={search || ''}
      isMap={isMap || false}
      count={count}
      view={view}
      assetType={assetType}
      onlyOnRent={onlyOnRent}
      onlyOnSale={onlyOnSale}
      sortBy={sortBy}
      sortByOptions={sortByOptions}
      section={section}
      hasFiltersEnabled={filtersEnabled}
      isLoading={isLoading}
      onBrowse={handleBrowse}
      onClearFilters={handleClearFilters}
      onOpenFiltersModal={handleOpenFiltersModal}
    />
  )
}

export default AssetTopbarContainer
