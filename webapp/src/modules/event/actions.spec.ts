import {
  fetchEventFailure,
  fetchEventRequest,
  fetchEventSuccess,
  FETCH_EVENT_FAILURE,
  FETCH_EVENT_REQUEST,
  FETCH_EVENT_SUCCESS
} from './actions'

const anErrorMessage = 'An error'

describe('when creating the action to signal the start of the events request', () => {
  let tags: string[]
  beforeEach(() => {
    tags = ['a tag']
  })
  it('should return an object representing the action', () => {
    expect(fetchEventRequest(tags)).toEqual({
      type: FETCH_EVENT_REQUEST,
      meta: undefined,
      payload: {
        tags
      }
    })
  })
})

describe('when creating the action to signal a success in the events request', () => {
  let tags: string[]
  let contracts: string[]
  beforeEach(() => {
    tags = ['a tag']
    contracts = ['0x1', '0x2']
  })

  it('should return an object representing the action', () => {
    expect(fetchEventSuccess(tags, contracts)).toEqual({
      type: FETCH_EVENT_SUCCESS,
      meta: undefined,
      payload: { tags, contracts }
    })
  })
})

describe('when creating the action to signal a failure items request', () => {
  it('should return an object representing the action', () => {
    expect(fetchEventFailure(anErrorMessage)).toEqual({
      type: FETCH_EVENT_FAILURE,
      meta: undefined,
      payload: { error: anErrorMessage }
    })
  })
})
