import { getDefaultState } from '../../tests/defaultStore'
import { RootState } from '../reducer'
import { INITIAL_STATE } from './reducer'
import { getData, getError, getLoading, getState } from './selectors'

const eventTag = 'MVMF22'
const eventContracts = ['0x1', '0x2']

let state: RootState

beforeEach(() => {
  const defaultState = getDefaultState()
  state = {
    ...defaultState,
    event: {
      ...INITIAL_STATE,
      data: {
        [eventTag]: eventContracts
      },
      error: 'anError',
      loading: []
    }
  }
})

describe("when getting the events's state", () => {
  it('should return the state', () => {
    expect(getState(state)).toEqual(state.event)
  })
})

describe('when getting the data of the state', () => {
  it('should return the data', () => {
    expect(getData(state)).toEqual(state.event.data)
  })
})

describe('when getting the error of the state', () => {
  it('should return the error message', () => {
    expect(getError(state)).toEqual(state.event.error)
  })
})

describe('when getting the loading state of the state', () => {
  it('should return the loading state', () => {
    expect(getLoading(state)).toEqual(state.event.loading)
  })
})
