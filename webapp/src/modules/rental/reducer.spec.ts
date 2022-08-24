import { RentalListing } from '@dcl/schemas'
import { NFT } from '../nft/types'
import {
  createRentalFailure,
  createRentalRequest,
  createRentalSuccess
} from './actions'
import { rentalReducer, RentalState } from './reducer'
import { PeriodOption } from './types'

let nft: NFT
let rental: RentalListing

beforeEach(() => {
  nft = {
    id: 'someNft'
  } as NFT
  rental = {
    id: 'someRental'
  } as RentalListing
})

describe('when reducing a CREATE_RENTAL_REQUEST action', () => {
  let state: RentalState
  beforeEach(() => {
    state = {
      loading: [],
      data: {},
      error: null
    }
  })
  it('should add a the action to the loading state', () => {
    const action = createRentalRequest(
      nft,
      100,
      [PeriodOption.ONE_WEEK],
      1976562675847
    )
    const newState = rentalReducer(state, action)
    expect(newState.loading).toHaveLength(1)
    expect(newState.loading[0]).toEqual(action)
  })
})

describe('when reducing a CREATE_RENTAL_SUCCESS action', () => {
  let state: RentalState
  beforeEach(() => {
    state = {
      loading: [
        createRentalRequest(nft, 100, [PeriodOption.ONE_WEEK], 1976562675847)
      ],
      data: {},
      error: 'Some error'
    }
  })
  it('should remove the loading action', () => {
    const newState = rentalReducer(state, createRentalSuccess(nft, rental))
    expect(newState.loading).toHaveLength(0)
  })
  it('should clear the error', () => {
    const newState = rentalReducer(state, createRentalSuccess(nft, rental))
    expect(newState.error).toBe(null)
  })
  it('should add the rental to the data record', () => {
    const newState = rentalReducer(state, createRentalSuccess(nft, rental))
    expect(newState.data).toEqual({
      [rental.id]: rental
    })
  })
})

describe('when reducing a CREATE_RENTAL_FAILURE action', () => {
  let state: RentalState
  beforeEach(() => {
    state = {
      loading: [
        createRentalRequest(nft, 100, [PeriodOption.ONE_WEEK], 1976562675847)
      ],
      data: {},
      error: null
    }
  })
  it('should remove the loading action', () => {
    const newState = rentalReducer(
      state,
      createRentalFailure(
        nft,
        100,
        [PeriodOption.ONE_WEEK],
        1976562675847,
        'some error'
      )
    )
    expect(newState.loading).toHaveLength(0)
  })
  it('should store the error', () => {
    const newState = rentalReducer(
      state,
      createRentalFailure(
        nft,
        100,
        [PeriodOption.ONE_WEEK],
        1976562675847,
        'Some error'
      )
    )
    expect(newState.error).toBe('Some error')
  })
})
