import { RootState } from '../reducer'
import { AnalyticsState } from './reducer'
import { getState, getError, getLoading, getVolumeData } from './selectors'

let state: RootState

beforeEach(() => {
  state = {
    analytics: {
      volumeData: {
        creatorsEarnings: 1,
        creatorsEarningsUSD: 10,
        daoEarnings: 1,
        daoEarningsUSD: 10,
        sales: 1,
        volume: 100,
        volumeUSD: 1000
      },
      error: null,
      loading: []
    } as AnalyticsState
  } as RootState
})

describe('when getting the whole analytics state', () => {
  it('should return the current state of the analytics state', () => {
    const result = getState(state)
    expect(result).toStrictEqual(state.analytics)
  })
})

describe('when getting the volume data from the analytics state', () => {
  it('should return the data record', () => {
    const result = getVolumeData(state)
    expect(result).toStrictEqual(state.analytics.volumeData)
  })
})

describe('when getting the error from the store state', () => {
  it('should return the error', () => {
    const result = getError(state)
    expect(result).toStrictEqual(state.analytics.error)
  })
})

describe('when getting the loading from the store state', () => {
  it('should return the data record', () => {
    const result = getLoading(state)
    expect(result).toStrictEqual(state.analytics.loading)
  })
})
