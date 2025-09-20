import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { browse } from '../../../modules/routing/actions'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import { hasFiltersEnabled } from '../../../modules/routing/url-parser'
import { getView } from '../../../modules/ui/browse/selectors'
import AssetFiltersModal from './AssetFiltersModal'

export const AssetFiltersModalContainer: React.FC = () => {
  const dispatch = useDispatch()
  const browseOptions = useGetBrowseOptions()
  const view = useSelector(getView)

  const handleOnBrowse: ActionFunction<typeof browse> = useCallback(options => dispatch(browse(options)), [dispatch])

  return (
    <AssetFiltersModal
      view={view}
      assetType={browseOptions.assetType}
      hasFiltersEnabled={hasFiltersEnabled(browseOptions)}
      browseOptions={browseOptions}
      onBrowse={handleOnBrowse}
    />
  )
}

export default AssetFiltersModalContainer
