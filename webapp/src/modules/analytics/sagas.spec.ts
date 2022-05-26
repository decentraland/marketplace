import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'
import { VendorFactory, VendorName } from '../vendor'
import {
  fetchAnalyticsVolumeDataRequest,
  fetchAnalyticsVolumeDataSuccess,
  fetchAnalyticsVolumeDataFailure
} from './actions'
import { analyticsSagas } from './sagas'
import { AnalyticsTimeframe, AnalyticsVolumeData } from './types'

describe('when handling a fetch volume data request', () => {
  let timeframe: AnalyticsTimeframe
  let response: AnalyticsVolumeData
  const options = {
    vendor: VendorName.DECENTRALAND
  }
  const vendor = VendorFactory.build(options.vendor)
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
        .provide([
          [call(VendorFactory.build, options.vendor), vendor],
          [
            call(
              [
                vendor.analyticsService,
                vendor.analyticsService!.fetchVolumeData
              ],
              timeframe
            ),
            response
          ]
        ])
        .put(fetchAnalyticsVolumeDataSuccess(response))
        .dispatch(fetchAnalyticsVolumeDataRequest(timeframe))
        .silentRun()
    })
  })

  describe('when the api call fails', () => {
    it('should put a failure action with the error', () => {
      return expectSaga(analyticsSagas)
        .provide([
          [call(VendorFactory.build, options.vendor), vendor],
          [
            call(
              [
                vendor.analyticsService,
                vendor.analyticsService!.fetchVolumeData
              ],
              timeframe
            ),
            Promise.reject(new Error('some error'))
          ]
        ])
        .put(fetchAnalyticsVolumeDataFailure('some error'))
        .dispatch(fetchAnalyticsVolumeDataRequest(timeframe))
        .silentRun()
    })
  })
})
