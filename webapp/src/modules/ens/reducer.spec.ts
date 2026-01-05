import { ChainId } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { Route } from 'decentraland-transactions/crossChain'
import {
  claimNameSuccess,
  claimNameFailure,
  claimNameRequest,
  claimNameCrossChainRequest,
  claimNameCrossChainSuccess,
  claimNameWithCreditsRequest,
  claimNameWithCreditsSuccess,
  claimNameWithCreditsFailure,
  claimNameWithCreditsRouteExpired,
  claimNameWithCreditsCrossChainPolling,
  claimNameWithCreditsClearProgress,
  CLAIM_NAME_REQUEST,
  CLAIM_NAME_CROSS_CHAIN_REQUEST,
  CLAIM_NAME_FAILURE,
  CLAIM_NAME_CROSS_CHAIN_FAILURE,
  claimNameCrossChainFailure
} from './actions'
import { ENSState, ensReducer } from './reducer'
import { ENS } from './types'

describe('ENS Reducer', () => {
  const INITIAL_STATE: ENSState = {
    data: {},
    authorizations: {},
    loading: [],
    error: null,
    creditsClaimProgress: null
  }

  let ens: ENS
  let initialState: ENSState

  beforeEach(() => {
    ens = { subdomain: 'example' } as ENS
  })

  const requestActions = [
    claimNameRequest('example'),
    claimNameCrossChainRequest('example', ChainId.ETHEREUM_MAINNET, {} as Route),
    claimNameWithCreditsRequest('example')
  ]

  describe.each(requestActions)('when reducing the "$type" action', action => {
    initialState = { ...INITIAL_STATE }

    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        loading: []
      }
    })

    it('should return a state with the loading set and creditsClaimProgress cleared', () => {
      expect(ensReducer(initialState, action)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, action),
        creditsClaimProgress: null
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
  ])('when reducing the "%s" success action', (_action, requestAction, successAction) => {
    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        loading: [requestAction]
      }
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

  describe('when reducing the CLAIM_NAME_WITH_CREDITS_SUCCESS action', () => {
    const requestAction = claimNameWithCreditsRequest('example')
    const successAction = claimNameWithCreditsSuccess({ subdomain: 'example' } as ENS, 'example', 'aTxHash')

    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        loading: [requestAction],
        creditsClaimProgress: {
          name: 'example',
          polygonTxHash: '0x123',
          coralScanUrl: 'https://coralscan.squidrouter.com/tx/0x123',
          status: 'polling'
        }
      }
    })

    it('should return an state with the loading action removed, ens subdomain added, and creditsClaimProgress set to success', () => {
      expect(ensReducer(initialState, successAction)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, successAction),
        data: {
          ...initialState.data,
          [ens.subdomain]: {
            ...initialState.data[ens.subdomain],
            ...ens
          }
        },
        creditsClaimProgress: {
          ...initialState.creditsClaimProgress,
          status: 'success'
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
  ])('when handling the "%s" failure action', (_action, requestAction, failureAction, expectedError) => {
    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        loading: [requestAction]
      }
    })

    it('should return an state with the loading action removed and the error set', () => {
      expect(ensReducer(initialState, failureAction)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, failureAction),
        error: { message: expectedError }
      })
    })
  })

  describe('when handling the CLAIM_NAME_WITH_CREDITS_FAILURE action', () => {
    const requestAction = claimNameWithCreditsRequest('example')
    const failureAction = claimNameWithCreditsFailure('example', 'An error')

    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        loading: [requestAction],
        creditsClaimProgress: {
          name: 'example',
          polygonTxHash: '0x123',
          coralScanUrl: 'https://coralscan.squidrouter.com/tx/0x123',
          status: 'polling'
        }
      }
    })

    it('should return an state with the loading action removed, error set, and creditsClaimProgress set to failed', () => {
      expect(ensReducer(initialState, failureAction)).toEqual({
        ...initialState,
        loading: loadingReducer(initialState.loading, failureAction),
        error: { message: 'An error' },
        creditsClaimProgress: {
          ...initialState.creditsClaimProgress,
          status: 'failed'
        }
      })
    })
  })

  describe('when handling the CLAIM_NAME_WITH_CREDITS_ROUTE_EXPIRED action', () => {
    const routeExpiredAction = claimNameWithCreditsRouteExpired('example')

    beforeEach(() => {
      initialState = { ...INITIAL_STATE }
    })

    it('should return a state with creditsClaimProgress set to refetching_route', () => {
      expect(ensReducer(initialState, routeExpiredAction)).toEqual({
        ...initialState,
        creditsClaimProgress: {
          name: 'example',
          polygonTxHash: '',
          coralScanUrl: '',
          status: 'refetching_route'
        }
      })
    })
  })

  describe('when handling the CLAIM_NAME_WITH_CREDITS_CROSS_CHAIN_POLLING action', () => {
    const pollingAction = claimNameWithCreditsCrossChainPolling('example', '0x123', 'https://coralscan.squidrouter.com/tx/0x123')

    beforeEach(() => {
      initialState = { ...INITIAL_STATE }
    })

    it('should return a state with creditsClaimProgress set to polling', () => {
      expect(ensReducer(initialState, pollingAction)).toEqual({
        ...initialState,
        creditsClaimProgress: {
          name: 'example',
          polygonTxHash: '0x123',
          coralScanUrl: 'https://coralscan.squidrouter.com/tx/0x123',
          status: 'polling'
        }
      })
    })
  })

  describe('when handling the CLAIM_NAME_WITH_CREDITS_CLEAR_PROGRESS action', () => {
    const clearAction = claimNameWithCreditsClearProgress()

    beforeEach(() => {
      initialState = {
        ...INITIAL_STATE,
        creditsClaimProgress: {
          name: 'example',
          polygonTxHash: '0x123',
          coralScanUrl: 'https://coralscan.squidrouter.com/tx/0x123',
          status: 'success'
        }
      }
    })

    it('should return a state with creditsClaimProgress cleared', () => {
      expect(ensReducer(initialState, clearAction)).toEqual({
        ...initialState,
        creditsClaimProgress: null
      })
    })
  })
})
