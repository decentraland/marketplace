import {
  LocationChangeAction,
  LOCATION_CHANGE,
  RouterLocation
} from 'connected-react-router'
import { SET_IS_LOAD_MORE, SetIsLoadMoreAction } from './actions'

export type RoutingState = {
  isLoadMore: boolean
  visitedLocations: RouterLocation<unknown>[]
}

const INITIAL_STATE: RoutingState = {
  isLoadMore: false,
  visitedLocations: []
}

type RoutingReducerAction = SetIsLoadMoreAction | LocationChangeAction

export function routingReducer(
  state: RoutingState = INITIAL_STATE,
  action: RoutingReducerAction
) {
  switch (action.type) {
    case SET_IS_LOAD_MORE: {
      return {
        ...state,
        isLoadMore: action.payload.isLoadMore
      }
    }
    case LOCATION_CHANGE: {
      return {
        ...state,
        visitedLocations: [
          action.payload.location,
          ...state.visitedLocations,
        ].slice(0, 2) // only save last 2 locations
      }
    }
    default:
      return state
  }
}
