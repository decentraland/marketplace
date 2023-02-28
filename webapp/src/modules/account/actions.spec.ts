import {
  fetchCreatorsAccountFailure,
  fetchCreatorsAccountRequest,
  fetchCreatorsAccountSuccess,
  FETCH_CREATORS_ACCOUNT_FAILURE,
  FETCH_CREATORS_ACCOUNT_REQUEST,
  FETCH_CREATORS_ACCOUNT_SUCCESS
} from './actions'
import { CreatorAccount } from './types'

const search = 'aSearchTerm'
const anErrorMessage = 'An error'

describe('when creating the action to signal the start of the cretors request', () => {
  it('should return an object representing the action', () => {
    expect(fetchCreatorsAccountRequest(search)).toEqual({
      type: FETCH_CREATORS_ACCOUNT_REQUEST,
      meta: undefined,
      payload: {
        search
      }
    })
  })
})

describe('when creating the action to signal a success in the creators request', () => {
  const creators = [{} as CreatorAccount]

  it('should return an object representing the action', () => {
    expect(fetchCreatorsAccountSuccess(search, creators)).toEqual({
      type: FETCH_CREATORS_ACCOUNT_SUCCESS,
      meta: undefined,
      payload: { creatorAccounts: creators, search }
    })
  })
})

describe('when creating the action to signal a failure creators request', () => {
  it('should return an object representing the action', () => {
    expect(fetchCreatorsAccountFailure(search, anErrorMessage)).toEqual({
      type: FETCH_CREATORS_ACCOUNT_FAILURE,
      meta: undefined,
      payload: { error: anErrorMessage, search }
    })
  })
})
