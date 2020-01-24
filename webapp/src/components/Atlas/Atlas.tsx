import React, { useCallback, useMemo } from 'react'
import { Atlas as AtlasComponent, AtlasTile, Layer } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { ContractAddress } from '../../modules/contract/types'
import { LAND_API_URL } from '../../lib/api/land'
import { nftAPI } from '../../lib/api/nft'
import { Tile, Props } from './Atlas.types'

let tiles: Record<string, AtlasTile>
AtlasComponent.fetchTiles(LAND_API_URL + '/tiles').then(
  _tiles => (tiles = _tiles)
)

const getCoords = (x: number | string, y: number | string) => `${x},${y}`

const forSaleLayer: Layer = (x, y) => {
  const key = getCoords(x, y)
  if (!tiles) return null
  const tile = tiles[key]
  if (tile && 'price' in tile) {
    const { left, top, topLeft } = tile
    return { color: '#00d3ff', left, top, topLeft }
  }
  return null
}

const Atlas = (props: Props) => {
  const { onNavigate } = props

  const selection = useMemo(
    () =>
      (props.selection || []).reduce(
        (set, pair) => set.add(getCoords(pair.x, pair.y)),
        new Set<string>()
      ),
    [props.selection]
  )

  const isSelected = useCallback(
    (x: number, y: number) => {
      if (selection.has(getCoords(x, y))) return true
      // This is a workaround to paint the large estates, because GraphQL can return only up to 1000 results
      // and some Estates have more parcels than thats
      if (!tiles) return false
      const id = selection.values().next().value as string
      const center = tiles[id] as Tile
      const tile = tiles[getCoords(x, y)] as Tile
      if (
        center &&
        tile &&
        center.estate_id &&
        tile.estate_id &&
        center.estate_id === tile.estate_id
      ) {
        return true
      }
      return false
    },
    [selection]
  )

  const selectedStrokeLayer: Layer = useCallback(
    (x, y) => {
      return isSelected(x, y) ? { color: '#ff0044', scale: 1.4 } : null
    },
    [isSelected]
  )

  const selectedFillLayer: Layer = useCallback(
    (x, y) => {
      return isSelected(x, y) ? { color: '#ff9990', scale: 1.2 } : null
    },
    [isSelected]
  )

  const handleClick = useCallback(
    async (x: number, y: number) => {
      if (!tiles) return
      const tile = tiles[getCoords(x, y)] as Tile
      if (tile.estate_id) {
        onNavigate(locations.ntf(ContractAddress.ESTATE, tile.estate_id))
      } else {
        try {
          const tokenId = await nftAPI.fetchTokenId(tile.x, tile.y)
          onNavigate(locations.ntf(ContractAddress.LAND, tokenId))
        } catch (error) {
          console.warn(
            `Couldn't fetch parcel ${tile.x},${tile.y}: ${error.message}`
          )
        }
      }
    },
    [onNavigate]
  )

  return (
    <AtlasComponent
      {...props}
      tiles={tiles}
      onClick={handleClick}
      layers={[
        forSaleLayer,
        ...(props.layers || []),
        selectedStrokeLayer,
        selectedFillLayer
      ]}
    />
  )
}

export default Atlas
