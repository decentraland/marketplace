import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { fetchAnalyticsVolumeDataRequest, fetchAnalyticsVolumeDataSuccess, fetchAnalyticsVolumeDataFailure } from './actions'
import { analyticsSagas } from './sagas'
import { AnalyticsTimeframe, AnalyticsVolumeData } from './types'
import { AnalyticsService } from '../vendor/decentraland'

describe('when handling a fetch volume data request', () => {
  let timeframe: AnalyticsTimeframe
  let response: AnalyticsVolumeData

  beforeEach(() => {
    timeframe = AnalyticsTimeframe.WEEK
    response = {
      sales: 1,
      creatorsEarnings: 100,
      creatorsEarningsUSD: 1000,
      daoEarningsUSD: 1000,
      daoEarnings: 1000,
      volume: 1000,
      volumeUSD: 10000
    }
  })

  describe('when the api call is successful', () => {
    it('should put a success action with the volume for the timeframe asked', () => {
      return expectSaga(analyticsSagas)
        .provide([[matchers.call.fn(AnalyticsService.prototype.fetchVolumeData), Promise.resolve(response)]])
        .call.like({
          fn: AnalyticsService.prototype.fetchVolumeData,
          args: [timeframe]
        })
        .put(fetchAnalyticsVolumeDataSuccess(response))
        .dispatch(fetchAnalyticsVolumeDataRequest(timeframe))
        .silentRun()
    })
  })

  describe('when the api call fails', () => {
    it('should put a failure action with the error', () => {
      return expectSaga(analyticsSagas)
        .provide([[matchers.call.fn(AnalyticsService.prototype.fetchVolumeData), Promise.reject(new Error('some error'))]])
        .call.like({
          fn: AnalyticsService.prototype.fetchVolumeData,
          args: [timeframe]
        })
        .put(fetchAnalyticsVolumeDataFailure('some error'))
        .dispatch(fetchAnalyticsVolumeDataRequest(timeframe))
        .silentRun()
    })
  })
})
