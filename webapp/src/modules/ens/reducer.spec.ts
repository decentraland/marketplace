import { ChainId } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { Route } from 'decentraland-transactions/crossChain'
import {
  claimNameSuccess,
  claimNameFailure,
  claimNameRequest,
  claimNameCrossChainRequest,
  claimNameCrossChainSuccess,
  CLAIM_NAME_REQUEST,
  CLAIM_NAME_CROSS_CHAIN_REQUEST,
  CLAIM_NAME_FAILURE,
  CLAIM_NAME_CROSS_CHAIN_FAILURE,
  claimNameCrossChainFailure
} from './actions'
import { ENSState, ensReducer } from './reducer'
import { ENS } from './types'

describe('ENS Reducer', () => {
  const INITIAL_STATE = {
    data: {},
    authorizations: {},
    loading: [],
    error: null
  }

  let ens: ENS
  let initialState: ENSState

  beforeEach(() => {
    ens = { subdomain: 'example' } as ENS
  })

  const requestActions = [claimNameRequest('example'), claimNameCrossChainRequest('example', ChainId.ETHEREUM_MAINNET, {} as Route)]

  describe.each(requestActions)('when reducing the "$type" action', action => {
    initialState = { ...INITIAL_STATE } as ENSState

    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        loading: []
      }
    })

    it('should return a state with the loading set', () => {
      expect(ensReducer(initialState, action)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, action)
      })
    })
  })

  describe.each([
    [CLAIM_NAME_REQUEST, claimNameRequest('example'), claimNameSuccess({ subdomain: 'example' } as ENS, 'example', 'aTxHash')],
    [
      CLAIM_NAME_CROSS_CHAIN_REQUEST,
      claimNameCrossChainRequest('example', ChainId.ETHEREUM_MAINNET, {} as Route),
      claimNameCrossChainSuccess({ subdomain: 'example' } as ENS, 'example', 'aTxHash', {} as Route)
    ]
  ])('when reducing the "%s" action', (_action, requestAction, successAction) => {
    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        loading: [requestAction]
      } as ENSState
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

  describe.each([
    [CLAIM_NAME_FAILURE, claimNameRequest('example'), claimNameFailure({ message: 'An error' }), 'An error'],
    [
      CLAIM_NAME_CROSS_CHAIN_FAILURE,
      claimNameCrossChainRequest('example', ChainId.ETHEREUM_MAINNET, {} as Route),
      claimNameCrossChainFailure({} as Route, 'example', 'An error'),
      'An error'
    ]
  ])('when handling the "$s" action', (_action, requestAction, failureAction, expectedError) => {
    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        loading: [requestAction]
      } as ENSState
    })

    it('should return an state with the loading action removed and the error set', () => {
      expect(ensReducer(initialState, failureAction)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, failureAction),
        error: { message: expectedError }
      })
    })
  })
})
