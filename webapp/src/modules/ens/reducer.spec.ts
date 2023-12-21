import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { claimNameSuccess, claimNameClear, claimNameFailure } from './actions'
import { ENSState, ensReducer } from './reducer'
import { ENS, ENSError } from './types'

describe('ENS Reducer', () => {
  const INITIAL_STATE = {
    data: {},
    authorizations: {},
    loading: [],
    error: null
  }

  it('should handle CLAIM_NAME_SUCCESS action', () => {
    const ens = { subdomain: 'example' } as ENS
    const action = claimNameSuccess(ens, ens.subdomain, 'aTxHash')
    const initialState = { ...INITIAL_STATE } as ENSState
    const expectedState = {
      ...initialState,
      loading: loadingReducer(initialState.loading, action),
      data: {
        ...initialState.data,
        [ens.subdomain]: {
          ...initialState.data[ens.subdomain],
          ...ens
        }
      }
    }
    expect(ensReducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLAIM_NAME_FAILURE action', () => {
    const ensError = {} as ENSError
    const action = claimNameFailure(ensError)
    const initialState = { ...INITIAL_STATE } as ENSState
    const expectedState = {
      ...initialState,
      loading: loadingReducer(initialState.loading, action),
      data: {
        ...initialState.data
      },
      error: ensError
    }
    expect(ensReducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLAIM_NAME_CLEAR action', () => {
    const action = claimNameClear()
    const initialState = {
      ...INITIAL_STATE,
      error: {} as ENSError
    } as ENSState
    const expectedState = {
      ...initialState,
      error: null
    }
    expect(ensReducer(initialState, action)).toEqual(expectedState)
  })
})
