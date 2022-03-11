import { SetIsTryingOnAction, SET_IS_TRYING_ON } from './actions'

export type PreviewState = {
  isTryingOn: boolean
}

const INITIAL_STATE: PreviewState = {
  isTryingOn: false
}

type PreviewReducerAction = SetIsTryingOnAction

export function previewReducer(
  state = INITIAL_STATE,
  action: PreviewReducerAction
): PreviewState {
  switch (action.type) {
    case SET_IS_TRYING_ON: {
      return {
        ...state,
        isTryingOn: action.payload.value
      }
    }
    default:
      return state
  }
}
