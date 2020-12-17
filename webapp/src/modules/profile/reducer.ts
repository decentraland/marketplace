import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { Profile } from './types'
import {
  LoadProfileRequestAction,
  LoadProfileSuccessAction,
  LoadProfileFailureAction,
  LOAD_PROFILE_REQUEST,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  CHANGE_PROFILE,
  ChangeProfileAction
} from './actions'

export type ProfileState = {
  data: Record<string, Profile>
  loading: LoadingState
  error: Record<string, string>
}

const INITIAL_STATE: ProfileState = {
  data: {},
  loading: [],
  error: {}
}

export type ProfileReducerAction =
  | LoadProfileRequestAction
  | LoadProfileSuccessAction
  | LoadProfileFailureAction
  | ChangeProfileAction

export const profileReducer = (
  state = INITIAL_STATE,
  action: ProfileReducerAction
): ProfileState => {
  switch (action.type) {
    case LOAD_PROFILE_REQUEST:
    case LOAD_PROFILE_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case LOAD_PROFILE_SUCCESS: {
      const { address, profile } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          [address]: profile
        },
        loading: loadingReducer(state.loading, action)
      }
    }
    case CHANGE_PROFILE: {
      const { address, profile } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          [address]: { ...state.data[address], ...profile }
        }
      }
    }
    default:
      return state
  }
}
