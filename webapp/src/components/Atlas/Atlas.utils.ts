import { Tile } from './Atlas.types'

const getCoords = (x: number | string, y: number | string) => `${x},${y}`

// Whether a coordinate should be highlighted as part of the current selection.
//
// A coordinate in the selection is always highlighted. For Estates the selection can be incomplete
// (the indexer returns at most ~1000 parcels), so the highlight is expanded to every tile that shares
// the selection centre's `estate_id`. `strictSelection` turns that expansion off: when the selection is
// the authoritative composition (read from the registry), the expansion could only add parcels the
// Estate no longer contains, from a tile layer that is behind.
export function isTileInSelection(
  selection: Set<string>,
  tiles: Record<string, Tile> | null | undefined,
  x: number,
  y: number,
  isEstate: boolean,
  strictSelection: boolean
): boolean {
  if (selection.has(getCoords(x, y))) {
    return true
  }
  if (strictSelection || !tiles) {
    return false
  }
  const id = selection.values().next().value as string | undefined
  if (!id) {
    return false
  }
  const center = tiles[id]
  const tile = tiles[getCoords(x, y)]
  return !!(center && tile && center.estate_id && tile.estate_id && center.estate_id === tile.estate_id && isEstate)
}
