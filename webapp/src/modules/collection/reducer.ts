import { Collection } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchCollectionsFailureAction,
  FetchCollectionsRequestAction,
  FetchCollectionsSuccessAction,
  FETCH_COLLECTIONS_FAILURE,
  FETCH_COLLECTIONS_REQUEST,
  FETCH_COLLECTIONS_SUCCESS
} from './actions'

export type CollectionState = {
  data: Record<string, Collection>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: CollectionState = {
  data: {},
  loading: [],
  error: null
}

type CollectionReducerAction =
  | FetchCollectionsRequestAction
  | FetchCollectionsSuccessAction
  | FetchCollectionsFailureAction

export function collectionReducer(
  state = INITIAL_STATE,
  action: CollectionReducerAction
): CollectionState {
  switch (action.type) {
    case FETCH_COLLECTIONS_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_COLLECTIONS_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_COLLECTIONS_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    default:
      return state
  }
}
