import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import { fetchEventFailure, fetchEventRequest, fetchEventSuccess } from './actions'
import { builderAPI } from '../vendor/decentraland/builder/api'
import { eventSaga } from './sagas'

const anError = new Error('An error occured')

const eventTag = 'MVMF22'
const eventContracts = ['0x1', '0x2']

describe('when handling the fetch events request action', () => {
  describe('and the api call fails', () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(eventSaga)
        .provide([[call([builderAPI, 'fetchAddressesByTag'], [eventTag]), Promise.reject(anError)]])
        .put(fetchEventFailure(anError.message))
        .dispatch(fetchEventRequest(eventTag))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the api call fails', () => {
    it('should dispatch an action signaling the success of the action handling', () => {
      return expectSaga(eventSaga)
        .provide([[call([builderAPI, 'fetchAddressesByTag'], [eventTag]), eventContracts]])
        .put(fetchEventSuccess(eventTag, eventContracts))
        .dispatch(fetchEventRequest(eventTag))
        .run({ silenceTimeout: true })
    })
  })
})
