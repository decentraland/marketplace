import { Collection } from '@dcl/schemas'
import { fetchCollectionsFailure, fetchCollectionsRequest, fetchCollectionsSuccess, FETCH_COLLECTIONS_REQUEST } from './actions'
import { collectionReducer, INITIAL_STATE } from './reducer'

describe('when fetch collection request action is received', () => {
  it('should add a loading state action to the loading state array', () => {
    const newState = collectionReducer(
      INITIAL_STATE,
      fetchCollectionsRequest(
        {
          name: 'name',
          contractAddress: 'contractAddress',
          creator: 'creator'
        },
        true
      )
    )
    expect(newState.loading.length).toBe(1)
    expect(newState.loading[0].type).toBe(FETCH_COLLECTIONS_REQUEST)
  })
})

describe('when fetch collection success action is received', () => {
  it('should update data, set error to null remove the request loading state and update the count', () => {
    const newState = collectionReducer(
      {
        count: 0,
        loading: [{ type: FETCH_COLLECTIONS_REQUEST }],
        error: 'some error',
        data: {}
      },
      fetchCollectionsSuccess([{ urn: 'some urn' }] as Collection[], 1)
    )
    expect(newState.loading.length).toBe(0)
    expect(newState.data).toStrictEqual({ ['some urn']: { urn: 'some urn' } })
    expect(newState.error).toBeNull()
    expect(newState.count).toBe(1)
  })
})

describe('when fetch collection failure action is received', () => {
  it('should update the error message and remove the request loading state', () => {
    const newState = collectionReducer(
      {
        count: 0,
        loading: [{ type: FETCH_COLLECTIONS_REQUEST }],
        error: 'some error',
        data: {}
      },
      fetchCollectionsFailure('some other error')
    )
    expect(newState.loading.length).toBe(0)
    expect(newState.error).toBe('some other error')
  })
})
