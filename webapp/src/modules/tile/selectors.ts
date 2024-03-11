import { createSelector } from 'reselect'
import { TileState } from './reducer'
import { RootState } from '../reducer'
import { Tile } from '../../components/Atlas/Atlas.types'

export const getState = (state: RootState) => state.tile
export const getTiles = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error
export const getLastModifiedDate = (state: RootState) => getState(state).lastModified

export const getTilesByEstateId = createSelector<RootState, TileState['data'], Record<string, Tile[]>>(getTiles, tiles => {
  const tilesByEstateId: Record<string, Tile[]> = {}
  for (const tile of Object.values(tiles) as Tile[]) {
    if (tile.estate_id) {
      if (!tilesByEstateId[tile.estate_id]) {
        tilesByEstateId[tile.estate_id] = []
      }
      tilesByEstateId[tile.estate_id].push(tile)
    }
  }
  return tilesByEstateId
})
