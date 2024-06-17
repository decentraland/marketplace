import { Location } from 'history'
import { LOCATION_CHANGED, LocationChangedAction } from './actions'

export type RoutingState = {
  location: Location
}

export const INITIAL_STATE: RoutingState = {
  location: { hash: window.location.hash, pathname: window.location.pathname, search: window.location.search, state: null }
}

type RoutingReducerAction = LocationChangedAction

export function routingReducer(state = INITIAL_STATE, action: RoutingReducerAction): RoutingState {
  switch (action.type) {
    case LOCATION_CHANGED:
      return {
        location: action.payload.location
      }
    default:
      return state
  }
}
