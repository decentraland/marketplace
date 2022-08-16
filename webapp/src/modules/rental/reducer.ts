import { RentalListing } from '@dcl/schemas'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
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

type RentalReducerAction = FetchNFTsSuccessAction | FetchNFTSuccessAction

export function rentalReducer(
  state = INITIAL_STATE,
  action: RentalReducerAction
): RentalState {
  switch (action.type) {
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
