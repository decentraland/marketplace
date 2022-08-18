import { RentalListing } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  CreateRentalFailureAction,
  CreateRentalRequestAction,
  CreateRentalSuccessAction,
  CREATE_RENTAL_FAILURE,
  CREATE_RENTAL_REQUEST,
  CREATE_RENTAL_SUCCESS
} from './actions'

export type RentalState = {
  data: Record<string, RentalListing>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: RentalState = {
  data: {},
  loading: [],
  error: null
}

type RentalReducerAction =
  | CreateRentalRequestAction
  | CreateRentalSuccessAction
  | CreateRentalFailureAction

export function rentalReducer(
  state = INITIAL_STATE,
  action: RentalReducerAction
): RentalState {
  switch (action.type) {
    case CREATE_RENTAL_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case CREATE_RENTAL_SUCCESS: {
      const { rental } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          [rental.id]: rental
        },
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case CREATE_RENTAL_FAILURE: {
      const { error } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error
      }
    }
    default:
      return state
  }
}
