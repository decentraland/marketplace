import { useCallback } from 'react'
import { useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Atlas } from '../../Atlas'
import { Props } from './MapBrowse.types'

export function MapBrowse({
  isMapViewFiltersEnabled,
  onlyOnRent,
  onlyOnSale,
  showOwned,
  onBrowse
}: Props) {
  const isMobileOrTable = useTabletAndBelowMediaQuery()

  const handleSetFullscreen = useCallback(
    () => onBrowse({ isMap: true, isFullscreen: true }),
    [onBrowse]
  )

  return (
    <div className="Atlas">
      <Atlas
        minSize={4}
        withNavigation
        withPopup={!isMobileOrTable}
        withMapColorsInfo={isMapViewFiltersEnabled}
        withZoomControls={isMapViewFiltersEnabled}
        showOnSale={isMapViewFiltersEnabled ? !!onlyOnSale : onlyOnSale}
        showForRent={isMapViewFiltersEnabled ? !!onlyOnRent : undefined}
        showOwned={isMapViewFiltersEnabled ? showOwned : undefined}
      />
      <div className="fullscreen-button" onClick={handleSetFullscreen} />
    </div>
  )
}
