import { Item, Network } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  pickItemAsFavoriteFailure,
  pickItemAsFavoriteRequest,
  pickItemAsFavoriteSuccess,
  undoUnpickingItemAsFavoriteFailure,
  undoUnpickingItemAsFavoriteRequest,
  undoUnpickingItemAsFavoriteSuccess,
  unpickItemAsFavoriteFailure,
  unpickItemAsFavoriteRequest,
  unpickItemAsFavoriteSuccess
} from './actions'
import { INITIAL_STATE, favoritesReducer } from './reducer'

const item = {
  id: '0xContactAddress-anItemId',
  name: 'aName',
  contractAddress: '0xContactAddress',
  itemId: 'itemId',
  price: '1500000000000000000000',
  network: Network.ETHEREUM
} as Item

const error = 'anErrorMessage'

const requestActions = [
  pickItemAsFavoriteRequest(item),
  unpickItemAsFavoriteRequest(item),
  undoUnpickingItemAsFavoriteRequest(item)
]

requestActions.forEach(action => {
  describe(`when reducing the "${action.type}" action`, () => {
    it('should return a state with the loading set', () => {
      const initialState = {
        ...INITIAL_STATE,
        loading: []
      }

      expect(favoritesReducer(initialState, action)).toEqual({
        ...INITIAL_STATE,
        loading: loadingReducer(initialState.loading, action)
      })
    })
  })
})

const failureActions = [
  {
    request: pickItemAsFavoriteRequest(item),
    failure: pickItemAsFavoriteFailure(item, error)
  },
  {
    request: unpickItemAsFavoriteRequest(item),
    failure: unpickItemAsFavoriteFailure(item, error)
  },
  {
    request: undoUnpickingItemAsFavoriteRequest(item),
    failure: undoUnpickingItemAsFavoriteFailure(item, error)
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

      expect(favoritesReducer(initialState, action.failure)).toEqual({
        ...INITIAL_STATE,
        error,
        loading: []
      })
    })
  })
})

const pickAndUndoSuccessActions = [
  {
    request: pickItemAsFavoriteRequest(item),
    success: pickItemAsFavoriteSuccess(item)
  },
  {
    request: undoUnpickingItemAsFavoriteRequest(item),
    success: undoUnpickingItemAsFavoriteSuccess(item)
  }
]

pickAndUndoSuccessActions.forEach(action => {
  describe(`when reducing the "${action.success.type}" action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      data: {
        [item.id]: {
          pickedByUser: false,
          count: 0
        }
      },
      loading: loadingReducer([], action.request)
    }

    it('should return a state with the current item count incremented by one, flagged as picked by user, and the loading state cleared', () => {
      expect(favoritesReducer(initialState, action.success)).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: {
          ...initialState.data,
          [item.id]: {
            pickedByUser: true,
            count: 1
          }
        }
      })
    })
  })
})

describe('when reducing the successful action of unpicking the item as favorite', () => {
  const requestAction = unpickItemAsFavoriteRequest(item)
  const successAction = unpickItemAsFavoriteSuccess(item)

  const initialState = {
    ...INITIAL_STATE,
    data: {
      [item.id]: {
        pickedByUser: true,
        count: 1
      }
    },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the current item count decreased by one, flagged as non picked by user, and the loading state cleared', () => {
    expect(favoritesReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: {
        ...initialState.data,
        [item.id]: {
          pickedByUser: false,
          count: 0
        }
      }
    })
  })
})
