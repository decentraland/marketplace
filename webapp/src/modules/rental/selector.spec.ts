import { NFTCategory, RentalListing } from '@dcl/schemas'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { RootState } from '../reducer'
import { getState, getData, getRentalById } from './selectors'

let rootState: RootState

beforeEach(() => {
  rootState = {
    rental: {
      data: {} as Record<string, RentalListing>,
      loading: [] as LoadingState,
      error: null
    }
  } as RootState
})

describe('when getting the rentals state from the root state', () => {
  it('should retrieve the rentals state', () => {
    expect(getState(rootState)).toBe(rootState.rental)
  })
})

describe('when getting the data of the rental state', () => {
  it('should retrieve the data of the rental state', () => {
    expect(getData(rootState)).toBe(rootState.rental.data)
  })
})

describe('when getting a rental by id', () => {
  let id: string

  beforeEach(() => {
    id = 'aRentalId'
  })

  describe('and the rental exists in the state', () => {
    beforeEach(() => {
      rootState.rental.data = {
        [id]: { id, category: NFTCategory.PARCEL } as RentalListing
      }
    })

    it('should return the rental', () => {
      expect(getRentalById(rootState, id)).toBe(rootState.rental.data[id])
    })
  })

  describe("and the rental doesn't exist in the state", () => {
    beforeEach(() => {
      delete rootState.rental.data[id]
    })

    it('should return null', () => {
      expect(getRentalById(rootState, id)).toBe(null)
    })
  })
})
