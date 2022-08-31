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
import {
  FetchNFTsSuccessAction,
  FetchNFTSuccessAction,
  FETCH_NFTS_SUCCESS,
  FETCH_NFT_SUCCESS
} from '../nft/actions'

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
  | FetchNFTsSuccessAction
  | FetchNFTSuccessAction

export function rentalReducer(
  state = INITIAL_STATE,
  action: RentalReducerAction
): RentalState {
  switch (action.type) {
    case CREATE_RENTAL_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
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
    case FETCH_NFTS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...Object.fromEntries(
            action.payload.rentals.map(rental => [rental.id, rental])
          )
        }
      }
    }
    case FETCH_NFT_SUCCESS: {
      if (!action.payload.rental) {
        return state
      }

      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.rental.id]: action.payload.rental
        }
      }
    }
    default:
      return state
  }
}
