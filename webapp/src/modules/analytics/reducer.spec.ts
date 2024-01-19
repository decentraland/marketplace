import {
  fetchAnalyticsVolumeDataRequest,
  fetchAnalyticsVolumeDataFailure,
  fetchAnalyticsVolumeDataSuccess,
  FETCH_ANALYTICS_VOLUME_DATA_REQUEST
} from './actions'
import { analyticsReducer } from './reducer'
import { INITIAL_STATE } from './reducer'
import { AnalyticsTimeframe, AnalyticsVolumeData } from './types'

describe('when fetch volume data request action is received', () => {
  it('should add a loading state action to the loading state array', () => {
    const newState = analyticsReducer(
      INITIAL_STATE,
      fetchAnalyticsVolumeDataRequest(AnalyticsTimeframe.MONTH)
    )
    expect(newState.loading.length).toBe(1)
    expect(newState.loading[0].type).toBe(FETCH_ANALYTICS_VOLUME_DATA_REQUEST)
  })
})

describe('when fetch volume data success action is received', () => {
  let volumeResponse: AnalyticsVolumeData
  beforeEach(() => {
    volumeResponse = {
      creatorsEarnings: 100,
      creatorsEarningsUSD: 1000,
      daoEarnings: 100,
      daoEarningsUSD: 1000,
      sales: 1,
      volume: 100,
      volumeUSD: 1000
    }
  })
  it('should update data, set error to null remove the request loading state and update the count', () => {
    const newState = analyticsReducer(
      {
        volumeData: null,
        rankingsData: [],
        loading: [{ type: FETCH_ANALYTICS_VOLUME_DATA_REQUEST }],
        error: 'some error'
      },
      fetchAnalyticsVolumeDataSuccess(volumeResponse)
    )
    expect(newState.loading.length).toBe(0)
    expect(newState.volumeData).toStrictEqual(volumeResponse)
    expect(newState.error).toBeNull()
  })
})

describe('when fetch volume data failure action is received', () => {
  it('should update the error message and remove the request loading state', () => {
    const newState = analyticsReducer(
      {
        volumeData: { sales: 1 } as AnalyticsVolumeData,
        rankingsData: [],
        loading: [{ type: FETCH_ANALYTICS_VOLUME_DATA_REQUEST }],
        error: 'some error'
      },
      fetchAnalyticsVolumeDataFailure('some other error')
    )
    expect(newState.loading.length).toBe(0)
    expect(newState.error).toBe('some other error')
    expect(newState.volumeData).toStrictEqual({
      sales: 1
    } as AnalyticsVolumeData)
  })
})
