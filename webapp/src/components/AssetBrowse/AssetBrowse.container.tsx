import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { browse, fetchAssetsFromRoute } from '../../modules/routing/actions'
import { useGetBrowseOptions } from '../../modules/routing/hooks'
import { isMapSet } from '../../modules/routing/utils'
import { setView } from '../../modules/ui/actions'
import { getView } from '../../modules/ui/browse/selectors'
import AssetBrowse from './AssetBrowse'
import { ContainerProps } from './AssetBrowse.types'

const AssetBrowseContainer: React.FC<ContainerProps> = props => {
  const dispatch = useDispatch()
  const { assetType, section, onlyOnSale, onlyOnRent, onlySmart, isMap, status, isFullscreen } = useGetBrowseOptions()

  const view = useSelector(getView)
  const computedIsMap = useMemo(() => isMapSet(isMap, section, view), [isMap, section, view])
  const computedIsFullscreen = useMemo(() => isFullscreen ?? isMap, [isFullscreen, isMap])

  const handleSetView = useCallback<ActionFunction<typeof setView>>(view => dispatch(setView(view)), [dispatch])
  const handleFetchAssetsFromRoute = useCallback<ActionFunction<typeof fetchAssetsFromRoute>>(
    options => dispatch(fetchAssetsFromRoute(options)),
    [dispatch]
  )
  const handleBrowse = useCallback<ActionFunction<typeof browse>>(options => dispatch(browse(options)), [dispatch])

  return (
    <AssetBrowse
      isMap={computedIsMap}
      isFullscreen={computedIsFullscreen}
      onlyOnSale={onlyOnSale}
      status={status}
      section={props.section ?? section}
      assetType={assetType}
      viewInState={view}
      onlySmart={onlySmart}
      onlyOnRent={onlyOnRent}
      onSetView={handleSetView}
      onFetchAssetsFromRoute={handleFetchAssetsFromRoute}
      onBrowse={handleBrowse}
      {...props}
    />
  )
}

export default AssetBrowseContainer
