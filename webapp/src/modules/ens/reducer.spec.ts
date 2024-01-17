import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  claimNameSuccess,
  claimNameFailure,
  claimNameClear,
  claimNameRequest
} from './actions'
import { ENSState, ensReducer } from './reducer'
import { ENS, ENSError } from './types'

describe('ENS Reducer', () => {
  const INITIAL_STATE = {
    data: {},
    authorizations: {},
    loading: [],
    error: null
  }

  let ens: ENS
  let requestAction: ReturnType<typeof claimNameRequest>
  let successAction: ReturnType<typeof claimNameSuccess>
  let failureAction: ReturnType<typeof claimNameFailure>
  let clearAction: ReturnType<typeof claimNameClear>
  let initialState: ENSState

  describe('when handling the CLAIM_NAME_REQUEST action', () => {
    beforeEach(() => {
      ens = { subdomain: 'example' } as ENS
      requestAction = claimNameRequest(ens.subdomain)
      initialState = { ...INITIAL_STATE } as ENSState
    })
    it('should return an state with the loading action placed', () => {
      expect(ensReducer(initialState, requestAction)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, requestAction)
      })
    })
  })
  describe('when handling the CLAIM_NAME_SUCCESS action', () => {
    beforeEach(() => {
      ens = { subdomain: 'example' } as ENS
      successAction = claimNameSuccess(ens, ens.subdomain, 'aTxHash')
      initialState = { ...INITIAL_STATE } as ENSState
    })
    it('should return an state with the loading action removed and the new ens subdomain added to the data', () => {
      expect(ensReducer(initialState, successAction)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, successAction),
        data: {
          ...initialState.data,
          [ens.subdomain]: {
            ...initialState.data[ens.subdomain],
            ...ens
          }
        }
      })
    })
  })

  describe('when handling the CLAIM_NAME_FAILURE action', () => {
    const ensError = {} as ENSError
    beforeEach(() => {
      failureAction = claimNameFailure(ensError)
      initialState = { ...INITIAL_STATE } as ENSState
    })
    it('should return an state with the loading action removed and the error set', () => {
      expect(ensReducer(initialState, failureAction)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, failureAction),
        error: ensError
      })
    })
  })
  describe('when handling the CLAIM_NAME_CLEAR action', () => {
    beforeEach(() => {
      clearAction = claimNameClear()
      initialState = { ...INITIAL_STATE, error: {} as ENSError } as ENSState
    })
    it('should return a state with the error cleared', () => {
      expect(ensReducer(initialState, clearAction)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, failureAction),
        error: null
      })
    })
  })
})
