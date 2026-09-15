import { isTileInSelection } from './Atlas.utils'
import { Tile } from './Atlas.types'

const tile = (estateId: string): Tile => ({ estate_id: estateId }) as Tile

// An Estate of two parcels, (1,1) and (2,1), both carrying the same estate_id in the tile layer.
const tiles: Record<string, Tile> = { '1,1': tile('42'), '2,1': tile('42') }
const selectionOf = (...coords: string[]) => new Set(coords)

describe('isTileInSelection', () => {
  it('should highlight a coordinate that is in the selection', () => {
    expect(isTileInSelection(selectionOf('1,1'), tiles, 1, 1, true, false)).toBe(true)
  })

  // The estate_id expansion: a tile not in the selection but sharing the centre's estate_id is added.
  it('should expand to a same-estate tile when the selection may be incomplete', () => {
    expect(isTileInSelection(selectionOf('1,1'), tiles, 2, 1, true, false)).toBe(true)
  })

  // The security-relevant case: with the authoritative selection, the expansion is off, so a parcel the
  // Estate no longer contains — still in a stale tile layer — is not re-added to what the user reviews.
  it('should not expand beyond the selection when strict', () => {
    expect(isTileInSelection(selectionOf('1,1'), tiles, 2, 1, true, true)).toBe(false)
  })

  it('should still highlight the selected parcels when strict', () => {
    expect(isTileInSelection(selectionOf('1,1', '2,1'), tiles, 2, 1, true, true)).toBe(true)
  })

  it('should not expand for a non-estate asset', () => {
    expect(isTileInSelection(selectionOf('1,1'), tiles, 2, 1, false, false)).toBe(false)
  })

  it('should not expand when there are no tiles', () => {
    expect(isTileInSelection(selectionOf('1,1'), null, 2, 1, true, false)).toBe(false)
  })
})
