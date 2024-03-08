import { AtlasTile } from 'decentraland-ui'
import { LoadingState, loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchTilesRequestAction,
  FetchTilesSuccessAction,
  FetchTilesFailureAction,
  FETCH_TILES_REQUEST,
  FETCH_TILES_SUCCESS,
  FETCH_TILES_FAILURE
} from './actions'

export type TileState = {
  data: Record<string, AtlasTile>
  lastModified: Date | null
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: TileState = {
  data: {},
  lastModified: null,
  loading: [],
  error: null
}

type TileReducerAction = FetchTilesRequestAction | FetchTilesSuccessAction | FetchTilesFailureAction

export function tileReducer(state = INITIAL_STATE, action: TileReducerAction) {
  switch (action.type) {
    case FETCH_TILES_REQUEST: {
      return {
        ...state,
        lastModified: null,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_TILES_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        lastModified: action.payload.lastModified,
        error: null,
        data: action.payload.tiles
      }
    }
    case FETCH_TILES_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    default:
      return state
  }
}
