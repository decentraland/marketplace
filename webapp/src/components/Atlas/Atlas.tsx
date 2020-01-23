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

const forSaleLayer: Layer = (x, y) => {
  const key = x + ',' + y
  if (!tiles) return null
  const tile = tiles[key]
  if (tile && 'price' in tile) {
    const { left, top, topLeft } = tile
    return { color: '#00d3ff', left, top, topLeft }
  }
  return null
}

const coords = (x: number | string, y: number | string) => `${x},${y}`

const Atlas = (props: Props) => {
  const { onNavigate } = props

  const selection = useMemo(
    () =>
      (props.selection || []).reduce(
        (set, pair) => set.add(coords(pair.x, pair.y)),
        new Set<string>()
      ),
    [props.selection]
  )

  const selectedStrokeLayer: Layer = useCallback(
    (x, y) =>
      selection.has(coords(x, y)) ? { color: '#ff0044', scale: 1.4 } : null,
    [selection]
  )

  const selectedFillLayer: Layer = useCallback(
    (x, y) =>
      selection.has(coords(x, y)) ? { color: '#ff9990', scale: 1.2 } : null,
    [selection]
  )

  const handleClick = useCallback(
    async (x: number, y: number) => {
      if (!tiles) return
      const tile = tiles[x + ',' + y] as Tile
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
