import { select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { StaticProvider, throwError } from 'redux-saga-test-plan/providers'
import { fetchApplicationFeaturesSuccess } from 'decentraland-dapps/dist/modules/features/actions'
import { hasLoadedInitialFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { getIsCancelledOrdersBannerEnabled } from '../features/selectors'
import { generateIdentitySuccess } from '../identity/actions'
import { CancelledTradesAPI } from '../vendor/decentraland/cancelledTrades/api'
import { CancellationReason, CancelledTrade, CancelledTradesResponse } from '../vendor/decentraland/cancelledTrades/types'
import {
  fetchCancelledTradesFailure,
  fetchCancelledTradesRequest,
  fetchCancelledTradesSuccess,
  fetchMoreCancelledTradesFailure,
  fetchMoreCancelledTradesRequest,
  fetchMoreCancelledTradesSuccess
} from './actions'
import { CANCELLED_TRADES_PAGE_SIZE, cancelledTradesSaga } from './sagas'

const getIdentity = () => undefined

let address: string
let identity: AuthIdentity

beforeEach(() => {
  address = '0xabc0000000000000000000000000000000000001'
  identity = {} as AuthIdentity
})

describe('when the identity of the connected wallet is generated', () => {
  describe('and the feature flags have not been loaded yet', () => {
    let providers: StaticProvider[]

    beforeEach(() => {
      providers = [
        [select(hasLoadedInitialFlags), false],
        [select(getIsCancelledOrdersBannerEnabled), true],
        [matchers.call.fn(CancelledTradesAPI.prototype.fetchCancelledTrades), { data: [], total: 0 }]
      ]
    })

    it('should wait for the flags before requesting the cancelled trades', () => {
      return expectSaga(cancelledTradesSaga, getIdentity)
        .provide(providers)
        .take(fetchApplicationFeaturesSuccess([], {} as never).type)
        .put(fetchCancelledTradesRequest(address))
        .dispatch(generateIdentitySuccess(address, identity))
        .dispatch(fetchApplicationFeaturesSuccess([], {} as never))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the cancelled orders banner is enabled', () => {
    let providers: StaticProvider[]

    beforeEach(() => {
      providers = [
        [select(hasLoadedInitialFlags), true],
        [select(getIsCancelledOrdersBannerEnabled), true],
        [matchers.call.fn(CancelledTradesAPI.prototype.fetchCancelledTrades), { data: [], total: 0 }]
      ]
    })

    it('should request the cancelled trades of the wallet', () => {
      return expectSaga(cancelledTradesSaga, getIdentity)
        .provide(providers)
        .put(fetchCancelledTradesRequest(address))
        .dispatch(generateIdentitySuccess(address, identity))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the cancelled orders banner is disabled', () => {
    let providers: StaticProvider[]

    beforeEach(() => {
      providers = [
        [select(hasLoadedInitialFlags), true],
        [select(getIsCancelledOrdersBannerEnabled), false]
      ]
    })

    it('should not request the cancelled trades', () => {
      return expectSaga(cancelledTradesSaga, getIdentity)
        .provide(providers)
        .not.put(fetchCancelledTradesRequest(address))
        .dispatch(generateIdentitySuccess(address, identity))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request to fetch the cancelled trades', () => {
  describe('and the server responds with the cancelled trades', () => {
    let response: CancelledTradesResponse

    beforeEach(() => {
      response = { data: [{ id: 'a-trade-id' } as CancelledTrade], total: 1 }
    })

    it('should fetch the trades cancelled by the signature index bump and store them', () => {
      return expectSaga(cancelledTradesSaga, getIdentity)
        .provide([[matchers.call.fn(CancelledTradesAPI.prototype.fetchCancelledTrades), response]])
        .call.like({
          fn: CancelledTradesAPI.prototype.fetchCancelledTrades,
          args: [{ reason: CancellationReason.CONTRACT_SIGNATURE_INDEX_BUMP, first: CANCELLED_TRADES_PAGE_SIZE }]
        })
        .put(fetchCancelledTradesSuccess(address, response.data, response.total))
        .dispatch(fetchCancelledTradesRequest(address))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the request fails', () => {
    let error: Error

    beforeEach(() => {
      error = new Error('an error')
    })

    it('should put the failure with the error message', () => {
      return expectSaga(cancelledTradesSaga, getIdentity)
        .provide([[matchers.call.fn(CancelledTradesAPI.prototype.fetchCancelledTrades), throwError(error)]])
        .put(fetchCancelledTradesFailure(address, error.message))
        .dispatch(fetchCancelledTradesRequest(address))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request to fetch more cancelled trades', () => {
  describe('and the server responds with the next page', () => {
    let response: CancelledTradesResponse

    beforeEach(() => {
      response = { data: [{ id: 'a-trade-id' } as CancelledTrade], total: 500 }
    })

    it('should fetch the page that starts after the loaded trades and store it', () => {
      return expectSaga(cancelledTradesSaga, getIdentity)
        .provide([[matchers.call.fn(CancelledTradesAPI.prototype.fetchCancelledTrades), response]])
        .call.like({
          fn: CancelledTradesAPI.prototype.fetchCancelledTrades,
          args: [{ reason: CancellationReason.CONTRACT_SIGNATURE_INDEX_BUMP, first: CANCELLED_TRADES_PAGE_SIZE, skip: 100 }]
        })
        .put(fetchMoreCancelledTradesSuccess(address, response.data, response.total))
        .dispatch(fetchMoreCancelledTradesRequest(address, 100))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the request fails', () => {
    let error: Error

    beforeEach(() => {
      error = new Error('an error')
    })

    it('should put the failure with the error message', () => {
      return expectSaga(cancelledTradesSaga, getIdentity)
        .provide([[matchers.call.fn(CancelledTradesAPI.prototype.fetchCancelledTrades), throwError(error)]])
        .put(fetchMoreCancelledTradesFailure(address, error.message))
        .dispatch(fetchMoreCancelledTradesRequest(address, 100))
        .run({ silenceTimeout: true })
    })
  })
})
