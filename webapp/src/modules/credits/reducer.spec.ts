import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { fetchCreditsRequest, fetchCreditsSuccess, fetchCreditsFailure } from './actions'
import { creditsReducer, CreditsState } from './reducer'
import { CreditsResponse } from './types'

const INITIAL_STATE: CreditsState = {
  data: {},
  loading: [],
  error: null
}

describe('Credits reducer', () => {
  const address = '0x123'
  const error = 'error'
  const credits: CreditsResponse = {
    credits: [],
    totalCredits: 0
  }

  describe('when reducing the fetch credits request action', () => {
    it('should return a state with the loading set', () => {
      const initialState = { ...INITIAL_STATE }

      expect(creditsReducer(initialState, fetchCreditsRequest(address))).toEqual({
        ...INITIAL_STATE,
        loading: loadingReducer(initialState.loading, fetchCreditsRequest(address))
      })
    })
  })

  describe('when reducing the fetch credits success action', () => {
    it('should return a state with the credits set and the loading flag cleared', () => {
      const initialState = {
        ...INITIAL_STATE,
        loading: loadingReducer([], fetchCreditsRequest(address))
      }

      expect(creditsReducer(initialState, fetchCreditsSuccess(address, credits))).toEqual({
        ...INITIAL_STATE,
        loading: loadingReducer(initialState.loading, fetchCreditsSuccess(address, credits)),
        data: { [address]: credits }
      })
    })
  })

  describe('when reducing the fetch credits failure action', () => {
    it('should return a state with the error set and the loading flag cleared', () => {
      const initialState = {
        ...INITIAL_STATE,
        loading: loadingReducer([], fetchCreditsRequest(address))
      }

      expect(creditsReducer(initialState, fetchCreditsFailure(address, error))).toEqual({
        ...INITIAL_STATE,
        loading: loadingReducer(initialState.loading, fetchCreditsFailure(address, error)),
        error
      })
    })
  })
})
