import { RentalListing } from '@dcl/schemas'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { FetchNFTsSuccessAction, FETCH_NFTS_SUCCESS } from '../nft/actions'

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

type RentalReducerAction = FetchNFTsSuccessAction

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
    default:
      return state
  }
}
