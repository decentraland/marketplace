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
  ClaimLandTransactionSubmitted,
  ClaimLandSuccessAction,
  CLAIM_LAND_FAILURE,
  CLAIM_LAND_REQUEST,
  CLAIM_LAND_TRANSACTION_SUBMITTED,
  CLAIM_LAND_SUCCESS,
  ClearRentalErrors,
  CLEAR_RENTAL_ERRORS,
  UpsertRentalFailureAction,
  UpsertRentalRequestAction,
  UpsertRentalSuccessAction,
  UPSERT_RENTAL_FAILURE,
  UPSERT_RENTAL_REQUEST,
  UPSERT_RENTAL_SUCCESS,
  RemoveRentalFailureAction,
  RemoveRentalSuccessAction,
  RemoveRentalRequestAction,
  RemoveRentalTransactionSubmitted,
  REMOVE_RENTAL_REQUEST,
  REMOVE_RENTAL_SUCCESS,
  REMOVE_RENTAL_FAILURE,
  REMOVE_RENTAL_TRANSACTION_SUBMITTED
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
  | UpsertRentalRequestAction
  | UpsertRentalSuccessAction
  | UpsertRentalFailureAction
  | ClaimLandRequestAction
  | ClaimLandSuccessAction
  | ClaimLandFailureAction
  | ClaimLandTransactionSubmitted
  | ClearRentalErrors
  | RemoveRentalRequestAction
  | RemoveRentalSuccessAction
  | RemoveRentalFailureAction
  | RemoveRentalTransactionSubmitted
  | FetchNFTsSuccessAction
  | FetchNFTSuccessAction

export function rentalReducer(
  state = INITIAL_STATE,
  action: RentalReducerAction
): RentalState {
  switch (action.type) {
    case REMOVE_RENTAL_TRANSACTION_SUBMITTED:
    case CLAIM_LAND_TRANSACTION_SUBMITTED: {
      return {
        ...state,
        isSubmittingTransaction: false
      }
    }
    case REMOVE_RENTAL_REQUEST:
    case CLAIM_LAND_REQUEST: {
      return {
        ...state,
        isSubmittingTransaction: true,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case UPSERT_RENTAL_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case UPSERT_RENTAL_SUCCESS: {
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
    case REMOVE_RENTAL_SUCCESS: {
      const { nft } = action.payload
      const newState = {
        ...state,
        loading: loadingReducer(state.loading, action),
        isSubmittingTransaction: false,
        error: null
      }
      if (nft.openRentalId) {
        delete newState.data[nft.openRentalId]
      }
      return newState
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
    case REMOVE_RENTAL_FAILURE:
    case CLAIM_LAND_FAILURE:
    case UPSERT_RENTAL_FAILURE: {
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
