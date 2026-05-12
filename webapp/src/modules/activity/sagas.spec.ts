import { call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { AuthIdentity } from '@dcl/crypto'
import { Network } from '@dcl/schemas'
import { activityAPI } from '../vendor/decentraland/activity'
import { getIdentity } from '../identity/utils'
import {
  fetchUserActivityFailure,
  fetchUserActivityRequest,
  fetchUserActivitySuccess
} from './actions'
import { activitySaga } from './sagas'
import { ActivityEvent, ActivityEventType } from './types'

describe('when fetching user activity', () => {
  let identity: AuthIdentity
  let events: ActivityEvent[]

  beforeEach(() => {
    identity = { authChain: [], expiration: new Date(Date.now() + 60000), ephemeralIdentity: {} as any }
    events = [
      {
        id: 'sale:1',
        type: ActivityEventType.SALE_BUYER,
        timestamp: 1000,
        network: Network.MATIC,
        txHash: '0xabc',
        contractAddress: '0xnft',
        tokenId: '1',
        price: '100',
        counterparty: '0xseller',
        details: {} as any
      }
    ]
  })

  describe('and the API responds successfully', () => {
    it('should dispatch a success action with events + total', () => {
      return expectSaga(activitySaga)
        .provide([
          [call(getIdentity), identity],
          [call([activityAPI, activityAPI.fetchUserActivity], identity), { data: events, total: 1 }]
        ])
        .put(fetchUserActivitySuccess(events, 1))
        .dispatch(fetchUserActivityRequest())
        .run({ silenceTimeout: true })
    })
  })

  describe('and the API rejects', () => {
    it('should dispatch a failure action with the error message', () => {
      return expectSaga(activitySaga)
        .provide([
          [call(getIdentity), identity],
          [call([activityAPI, activityAPI.fetchUserActivity], identity), throwError(new Error('boom'))]
        ])
        .put(fetchUserActivityFailure('boom'))
        .dispatch(fetchUserActivityRequest())
        .run({ silenceTimeout: true })
    })
  })

  describe('and the identity cannot be obtained', () => {
    it('should dispatch a failure action', () => {
      return expectSaga(activitySaga)
        .provide([[call(getIdentity), throwError(new Error('no identity'))]])
        .put(fetchUserActivityFailure('no identity'))
        .dispatch(fetchUserActivityRequest())
        .run({ silenceTimeout: true })
    })
  })
})
