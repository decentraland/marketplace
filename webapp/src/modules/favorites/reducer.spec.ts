import { Item, Network } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  cancelPickItemAsFavorite,
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
  itemId: 'itemId ',
  price: '1500000000000000000000',
  network: Network.ETHEREUM
} as Item

const error = 'anErrorMessage'

const requestActions = [
  pickItemAsFavoriteRequest(item),
  unpickItemAsFavoriteRequest(item),
  undoUnpickingItemAsFavoriteRequest(item)
]

describe.each(requestActions)('when reducing the "$type" action', action => {
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

describe.each(failureActions)(
  `when reducing the "$failure.type" action`,
  ({ request, failure }) => {
    it('should return a state with the error set and the loading state cleared', () => {
      const initialState = {
        ...INITIAL_STATE,
        error: null,
        loading: loadingReducer([], request)
      }

      expect(favoritesReducer(initialState, failure)).toEqual({
        ...INITIAL_STATE,
        error,
        loading: []
      })
    })
  }
)

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

describe.each(pickAndUndoSuccessActions)(
  `when reducing the "$success.type" action`,
  ({ request, success }) => {
    const initialState = {
      ...INITIAL_STATE,
      data: {
        [item.id]: {
          pickedByUser: false,
          count: 0
        }
      },
      loading: loadingReducer([], request)
    }

    it('should return a state with the current item count incremented by one, flagged as picked by user, and the loading state cleared', () => {
      expect(favoritesReducer(initialState, success)).toEqual({
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
  }
)

describe('when reducing the action of canceling a pick item as favorite', () => {
  const requestAction = unpickItemAsFavoriteRequest(item)
  const cancelAction = cancelPickItemAsFavorite()

  const initialState = {
    ...INITIAL_STATE,
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with an empty loading state', () => {
    expect(favoritesReducer(initialState, cancelAction)).toEqual({
      ...INITIAL_STATE,
      loading: []
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
