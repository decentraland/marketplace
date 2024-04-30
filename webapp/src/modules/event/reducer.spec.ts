import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { fetchEventFailure, fetchEventRequest, fetchEventSuccess } from './actions'
import { eventReducer, INITIAL_STATE } from './reducer'

const anErrorMessage = 'An error'

const eventTag = 'MVMF22'
const eventAddresses = ['0x1', '0x2']

const requestActions = [fetchEventRequest(eventTag)]

requestActions.forEach(action => {
  describe(`when reducing the "${action.type}" action`, () => {
    it('should return a state with the loading set', () => {
      const initialState = {
        ...INITIAL_STATE,
        loading: []
      }

      expect(eventReducer(initialState, action)).toEqual({
        ...INITIAL_STATE,
        loading: loadingReducer(initialState.loading, action)
      })
    })
  })
})

const failureActions = [
  {
    request: fetchEventRequest(eventTag),
    failure: fetchEventFailure(anErrorMessage)
  }
]

failureActions.forEach(action => {
  describe(`when reducing the "${action.failure.type}" action`, () => {
    it('should return a state with the error set and the loading state cleared', () => {
      const initialState = {
        ...INITIAL_STATE,
        error: null,
        loading: loadingReducer([], action.request)
      }

      expect(eventReducer(initialState, action.failure)).toEqual({
        ...INITIAL_STATE,
        error: anErrorMessage,
        loading: []
      })
    })
  })
})

describe('when reducing the successful action of fetching an event addresses by tag', () => {
  const requestAction = fetchEventRequest(eventTag)
  const successAction = fetchEventSuccess(eventTag, eventAddresses)

  const initialState = {
    ...INITIAL_STATE,
    data: { event1: ['0x1', '0x2'] },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the loaded events and the loading state cleared', () => {
    expect(eventReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [eventTag]: eventAddresses }
    })
  })
})
