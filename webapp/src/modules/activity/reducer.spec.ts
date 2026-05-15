import { Network } from '@dcl/schemas'
import { fetchUserActivityFailure, fetchUserActivityRequest, fetchUserActivitySuccess } from './actions'
import { activityReducer, INITIAL_STATE } from './reducer'
import { ActivityEvent, ActivityEventType } from './types'

const makeEvent = (id: string, timestamp = 0): ActivityEvent =>
  ({
    id,
    type: ActivityEventType.SALE_BUYER,
    timestamp,
    network: Network.MATIC,
    contractAddress: '0xnft',
    tokenId: '1',
    price: '100',
    details: {} as any
  }) as ActivityEvent

describe('activityReducer', () => {
  describe('on FETCH_USER_ACTIVITY_REQUEST', () => {
    it('should clear any prior error and mark loading', () => {
      const previous = { ...INITIAL_STATE, error: 'prior boom' }
      const next = activityReducer(previous, fetchUserActivityRequest({ limit: 20, offset: 0 }))
      expect(next.error).toBeNull()
      expect(next.loading.length).toBeGreaterThan(0)
    })
  })

  describe('on FETCH_USER_ACTIVITY_SUCCESS with offset === 0 (first page)', () => {
    it('should replace any prior data', () => {
      const previous = { ...INITIAL_STATE, data: [makeEvent('old', 100)], loaded: 1, total: 1 }
      const next = activityReducer(previous, fetchUserActivitySuccess([makeEvent('new', 200)], 5, 0))
      expect(next.data.map(e => e.id)).toEqual(['new'])
      expect(next.loaded).toBe(1)
      expect(next.total).toBe(5)
    })
  })

  describe('on FETCH_USER_ACTIVITY_SUCCESS with offset > 0 (subsequent page)', () => {
    it('should append the new events to the existing data', () => {
      const previous = { ...INITIAL_STATE, data: [makeEvent('a', 100), makeEvent('b', 90)], loaded: 2, total: 4 }
      const next = activityReducer(previous, fetchUserActivitySuccess([makeEvent('c', 80), makeEvent('d', 70)], 4, 2))
      expect(next.data.map(e => e.id)).toEqual(['a', 'b', 'c', 'd'])
      expect(next.loaded).toBe(4)
      expect(next.total).toBe(4)
    })

    it('should dedupe events by id (defense against server shifting the slice between requests)', () => {
      const previous = { ...INITIAL_STATE, data: [makeEvent('a'), makeEvent('b'), makeEvent('c')], loaded: 3, total: 6 }
      // Page 2 returns events including a duplicate of 'c' because a new event arrived and shifted the slice
      const next = activityReducer(previous, fetchUserActivitySuccess([makeEvent('c'), makeEvent('d')], 6, 3))
      expect(next.data.map(e => e.id)).toEqual(['a', 'b', 'c', 'd'])
      expect(next.loaded).toBe(4)
    })
  })

  describe('on FETCH_USER_ACTIVITY_FAILURE', () => {
    it('should store the error and stop loading', () => {
      const previous = { ...INITIAL_STATE, loading: [{ type: '[Request] Fetch user activity' } as any] }
      const next = activityReducer(previous, fetchUserActivityFailure('boom'))
      expect(next.error).toBe('boom')
      expect(next.loading).toHaveLength(0)
    })
  })
})
