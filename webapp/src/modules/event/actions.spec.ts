import {
  fetchEventFailure,
  fetchEventRequest,
  fetchEventSuccess,
  FETCH_EVENT_FAILURE,
  FETCH_EVENT_REQUEST,
  FETCH_EVENT_SUCCESS
} from './actions'

const anErrorMessage = 'An error'
let eventTag: string
let additionalTags: string[]

describe('when creating the action to signal the start of the events request', () => {
  beforeEach(() => {
    eventTag = 'eventTag'
  })

  describe('and there are not additional searchTags', () => {
    it('should return an object representing the action', () => {
      expect(fetchEventRequest(eventTag)).toEqual({
        type: FETCH_EVENT_REQUEST,
        meta: undefined,
        payload: {
          eventTag,
          additionalSearchTags: []
        }
      })
    })
  })

  describe('and there are additional search tags', () => {
    beforeEach(() => {
      additionalTags = ['tag1', 'tag2']
    })
    it('should return an object representing the action', () => {
      expect(fetchEventRequest(eventTag, additionalTags)).toEqual({
        type: FETCH_EVENT_REQUEST,
        meta: undefined,
        payload: {
          eventTag,
          additionalSearchTags: additionalTags
        }
      })
    })
  })
})

describe('when creating the action to signal a success in the events request', () => {
  let contracts: string[]
  beforeEach(() => {
    eventTag = 'a tag'
    contracts = ['0x1', '0x2']
  })

  it('should return an object representing the action', () => {
    expect(fetchEventSuccess(eventTag, contracts)).toEqual({
      type: FETCH_EVENT_SUCCESS,
      meta: undefined,
      payload: { eventTag, contracts }
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
