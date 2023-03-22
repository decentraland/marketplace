import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Atlas } from '../../Atlas'
import { Props } from './MapBrowse.types'
import { Coordinate } from 'recharts/types/util/types'
import { getNearestTile, Coord } from './utils'
import { NFTCategory } from '@dcl/schemas'

export function MapBrowse({
  isMapViewFiltersEnabled,
  onlyOnRent,
  onlyOnSale,
  showOwned,
  tiles,
  ownedLands,
  onBrowse
}: Props) {
  const isMobileOrTable = useTabletAndBelowMediaQuery()
  const [x, setX] = useState<number>()
  const [y, setY] = useState<number>()

  const handleSetFullscreen = useCallback(
    () => onBrowse({ isMap: true, isFullscreen: true }),
    [onBrowse]
  )

  const tilesForRent = useMemo(
    () =>
      Object.values(tiles)
        .filter(tile => 'rentalPricePerDay' in tile)
        .map(({ x, y }) => ({ x, y })),
    [tiles]
  )
  const tilesForSale = useMemo(
    () =>
      Object.values(tiles)
        .filter(tile => 'price' in tile)
        .map(({ x, y }) => ({ x, y })),
    [tiles]
  )

  const ownedTiles = useMemo(
    () =>
      ownedLands.reduce<Array<Coord>>((tiles, nft) => {
        if (nft.category === NFTCategory.PARCEL && nft.data.parcel) {
          tiles.push({
            x: Number.parseInt(nft.data.parcel.x),
            y: Number.parseInt(nft.data.parcel.y)
          })
        }

        if (nft.category === NFTCategory.ESTATE && nft.data.estate) {
          nft.data.estate.parcels.forEach(parcel => {
            tiles.push({
              x: parcel.x,
              y: parcel.y
            })
          })
        }
        return tiles
      }, []),
    [ownedLands]
  )

  const handleCenterChange = useCallback(
    (center: Coordinate) => {
      setX(center.x)
      setY(center.y)
    },
    [setX, setY]
  )

  useEffect(() => {
    if (onlyOnRent && tilesForRent.length) {
      const newCenter = getNearestTile({ x: x || 0, y: y || 0 }, tilesForRent)
      if (newCenter) {
        setX(newCenter.x)
        setY(newCenter.y)
      }
    }
    // this eslint rule is causing a warning due to x and y not being in the
    // dependencies array. In this case, we don't want this useEffect to be
    // called when those values change so we are disabling the rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyOnRent])

  useEffect(() => {
    if (onlyOnSale && tilesForSale.length) {
      const newCenter = getNearestTile({ x: x || 0, y: y || 0 }, tilesForSale)
      if (newCenter) {
        setX(newCenter.x)
        setY(newCenter.y)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyOnSale])

  useEffect(() => {
    if (showOwned && ownedTiles.length) {
      const newCenter = getNearestTile({ x: x || 0, y: y || 0 }, ownedTiles)
      if (newCenter) {
        setX(newCenter.x)
        setY(newCenter.y)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOwned])

  return (
    <div className="Atlas">
      <Atlas
        x={x}
        y={y}
        onCenterChange={handleCenterChange}
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
