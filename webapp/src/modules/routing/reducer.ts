import { LocationChangeAction, LOCATION_CHANGE, RouterLocation } from 'connected-react-router'

export type RoutingState = {
  isLoadMore: boolean
  visitedLocations: RouterLocation<unknown>[]
}

const INITIAL_STATE: RoutingState = {
  isLoadMore: false,
  visitedLocations: []
}

type RoutingReducerAction = LocationChangeAction

export function routingReducer(state: RoutingState = INITIAL_STATE, action: RoutingReducerAction) {
  switch (action.type) {
    case LOCATION_CHANGE: {
      return {
        ...state,
        visitedLocations: [action.payload.location, ...state.visitedLocations].slice(0, 2) // only save last 2 locations
      }
    }
    default:
      return state
  }
}
