import { RentalListing } from '@dcl/schemas'
import { RootState } from '../reducer'

export const getState = (state: RootState) => state.rental
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error
export const getRentalById = (
  state: RootState,
  id: string
): RentalListing | null => getData(state)[id] ?? null
