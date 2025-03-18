import {
  fetchCreditsRequest,
  fetchCreditsSuccess,
  fetchCreditsFailure,
  FETCH_CREDITS_REQUEST,
  FETCH_CREDITS_SUCCESS,
  FETCH_CREDITS_FAILURE
} from './actions'
import { CreditsResponse } from './types'

describe('Credits actions', () => {
  const address = '0x123'
  const error = 'error'
  const credits: CreditsResponse = {
    credits: [],
    totalCredits: 0
  }

  describe('when creating the fetch credits request action', () => {
    it('should return an action signaling the start of the request', () => {
      expect(fetchCreditsRequest(address)).toEqual({
        type: FETCH_CREDITS_REQUEST,
        payload: { address }
      })
    })
  })

  describe('when creating the fetch credits success action', () => {
    it('should return an action signaling the success of the request', () => {
      expect(fetchCreditsSuccess(address, credits)).toEqual({
        type: FETCH_CREDITS_SUCCESS,
        payload: { address, credits }
      })
    })
  })

  describe('when creating the fetch credits failure action', () => {
    it('should return an action signaling the failure of the request', () => {
      expect(fetchCreditsFailure(address, error)).toEqual({
        type: FETCH_CREDITS_FAILURE,
        payload: { address, error }
      })
    })
  })
})
