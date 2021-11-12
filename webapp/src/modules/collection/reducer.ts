import { Collection } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchCollectionsFailureAction,
  FetchCollectionsRequestAction,
  FetchCollectionsSuccessAction,
  FetchCollectionTotalFailureAction,
  FetchCollectionTotalRequestAction,
  FetchCollectionTotalSuccessAction,
  FETCH_COLLECTIONS_FAILURE,
  FETCH_COLLECTIONS_REQUEST,
  FETCH_COLLECTIONS_SUCCESS,
  FETCH_COLLECTION_TOTAL_FAILURE,
  FETCH_COLLECTION_TOTAL_REQUEST,
  FETCH_COLLECTION_TOTAL_SUCCESS
} from './actions'

export type CollectionState = {
  data: Record<string, Collection>
  count: number
  total: number
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: CollectionState = {
  data: {},
  count: 0,
  total: 0,
  loading: [],
  error: null
}

type CollectionReducerAction =
  | FetchCollectionsRequestAction
  | FetchCollectionsSuccessAction
  | FetchCollectionsFailureAction
  | FetchCollectionTotalRequestAction
  | FetchCollectionTotalSuccessAction
  | FetchCollectionTotalFailureAction

export function collectionReducer(
  state = INITIAL_STATE,
  action: CollectionReducerAction
): CollectionState {
  switch (action.type) {
    case FETCH_COLLECTIONS_REQUEST:
    case FETCH_COLLECTION_TOTAL_REQUEST:
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
    case FETCH_COLLECTION_TOTAL_SUCCESS:
      const { total } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        total
      }
    case FETCH_COLLECTIONS_FAILURE:
    case FETCH_COLLECTION_TOTAL_FAILURE:
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
