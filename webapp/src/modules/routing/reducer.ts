import { SET_IS_LOAD_MORE, SetIsLoadMoreAction } from './actions'

export type RoutingState = {
  isLoadMore: boolean
}

const INITIAL_STATE: RoutingState = {
  isLoadMore: false
}

type RoutingReducerAction = SetIsLoadMoreAction

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
    default:
      return state
  }
}
