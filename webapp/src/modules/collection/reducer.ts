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
  count: number
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: CollectionState = {
  data: {},
  count: 0,
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
      const { collections, count } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: collections.reduce((acc, collection) => {
          acc[collection.urn] = collection
          return acc
        }, {} as CollectionState['data']),
        count
      }

    case FETCH_COLLECTIONS_FAILURE:
      const { error } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    default:
      return state
  }
}
