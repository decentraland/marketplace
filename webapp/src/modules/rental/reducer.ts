import { RentalListing } from '@dcl/schemas'
import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FetchNFTsSuccessAction,
  FetchNFTSuccessAction,
  FETCH_NFTS_SUCCESS,
  FETCH_NFT_SUCCESS
} from '../nft/actions'
import {
  ClaimLandFailureAction,
  ClaimLandRequestAction,
  ClaimLandSignedTransaction,
  ClaimLandSuccessAction,
  CLAIM_LAND_FAILURE,
  CLAIM_LAND_REQUEST,
  CLAIM_LAND_TRANSACTION_SUBMITTED,
  CLAIM_LAND_SUCCESS,
  ClearRentalErrors,
  CLEAR_RENTAL_ERRORS,
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
  isSubmittingTransaction: boolean
  error: string | null
}

const INITIAL_STATE: RentalState = {
  data: {},
  loading: [],
  isSubmittingTransaction: false,
  error: null
}

type RentalReducerAction =
  | CreateRentalRequestAction
  | CreateRentalSuccessAction
  | CreateRentalFailureAction
  | ClaimLandRequestAction
  | ClaimLandSuccessAction
  | ClaimLandFailureAction
  | ClaimLandSignedTransaction
  | ClearRentalErrors
  | FetchNFTsSuccessAction
  | FetchNFTSuccessAction

export function rentalReducer(
  state = INITIAL_STATE,
  action: RentalReducerAction
): RentalState {
  switch (action.type) {
    case CLAIM_LAND_TRANSACTION_SUBMITTED: {
      return {
        ...state,
        isSubmittingTransaction: false
      }
    }
    case CLAIM_LAND_REQUEST: {
      return {
        ...state,
        isSubmittingTransaction: true,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
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
    case CLAIM_LAND_SUCCESS: {
      const { rental } = action.payload
      const newState = {
        ...state,
        loading: loadingReducer(state.loading, action),
        isSubmittingTransaction: false,
        error: null
      }
      delete newState.data[rental.id]
      return newState
    }
    case CLAIM_LAND_FAILURE:
    case CREATE_RENTAL_FAILURE: {
      const { error } = action.payload
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        isSubmittingTransaction: false,
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
    case CLEAR_RENTAL_ERRORS: {
      return {
        ...state,
        error: null
      }
    }
    default:
      return state
  }
}
