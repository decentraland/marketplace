import { AnyAction } from 'redux'
import { RootState } from '../reducer'
import { FETCH_CREDITS_REQUEST } from './actions'
import { getData, getLoading, getError, isFetchingCredits, getCredits } from './selectors'
import { CreditsResponse } from './types'

let state: RootState

describe('Credits selectors', () => {
  const address = '0x123'
  const credits: CreditsResponse = {
    credits: [],
    totalCredits: 0
  }

  beforeEach(() => {
    state = {
      credits: {
        data: { [address]: credits },
        loading: [],
        error: null
      }
    } as unknown as RootState
  })

  describe('when getting the data state', () => {
    it('should return the data state', () => {
      expect(getData(state)).toEqual(state.credits.data)
    })
  })

  describe('when getting the loading state', () => {
    it('should return the loading state', () => {
      expect(getLoading(state)).toEqual(state.credits.loading)
    })
  })

  describe('when getting the error state', () => {
    it('should return the error state', () => {
      expect(getError(state)).toEqual(state.credits.error)
    })
  })

  describe('when getting if it is fetching credits', () => {
    it('should return true if it is fetching credits', () => {
      state.credits.loading = [FETCH_CREDITS_REQUEST as unknown as AnyAction] // TODO: fix this type
      expect(isFetchingCredits(state)).toBe(true)
    })

    it('should return false if it is not fetching credits', () => {
      expect(isFetchingCredits(state)).toBe(false)
    })
  })

  describe('when getting credits for an address', () => {
    it('should return the credits for that address', () => {
      expect(getCredits(state, address)).toEqual(credits)
    })

    it('should return undefined if there are no credits for that address', () => {
      expect(getCredits(state, '0x456')).toBeUndefined()
    })
  })
})
