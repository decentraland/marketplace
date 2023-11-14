import { action } from 'typesafe-actions'
import { AtlasTile } from 'decentraland-ui'

export const FETCH_TILES_REQUEST = '[Request] Fetch Tiles'
export const FETCH_TILES_SUCCESS = '[Success] Fetch Tiles'
export const FETCH_TILES_FAILURE = '[Failure] Fetch Tiles'

export const fetchTilesRequest = () => action(FETCH_TILES_REQUEST)
export const fetchTilesSuccess = (tiles: Record<string, AtlasTile>, lastModified: Date) =>
  action(FETCH_TILES_SUCCESS, { tiles, lastModified })
export const fetchTilesFailure = (error: string) =>
  action(FETCH_TILES_FAILURE, { error })

export type FetchTilesRequestAction = ReturnType<typeof fetchTilesRequest>
export type FetchTilesSuccessAction = ReturnType<typeof fetchTilesSuccess>
export type FetchTilesFailureAction = ReturnType<typeof fetchTilesFailure>
