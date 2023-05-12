import { Item, Network } from '@dcl/schemas'
import { ItemBrowseOptions } from '../item/types'
import { View } from '../ui/types'
import {
  cancelPickItemAsFavorite,
  CANCEL_PICK_ITEM_AS_FAVORITE,
  fetchFavoritedItemsFailure,
  fetchFavoritedItemsRequest,
  fetchFavoritedItemsSuccess,
  FETCH_FAVORITED_ITEMS_FAILURE,
  FETCH_FAVORITED_ITEMS_REQUEST,
  FETCH_FAVORITED_ITEMS_SUCCESS,
  pickItemAsFavoriteFailure,
  pickItemAsFavoriteRequest,
  pickItemAsFavoriteSuccess,
  PICK_ITEM_AS_FAVORITE_FAILURE,
  PICK_ITEM_AS_FAVORITE_REQUEST,
  PICK_ITEM_AS_FAVORITE_SUCCESS,
  undoUnpickingItemAsFavoriteFailure,
  undoUnpickingItemAsFavoriteRequest,
  undoUnpickingItemAsFavoriteSuccess,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS,
  unpickItemAsFavoriteFailure,
  unpickItemAsFavoriteRequest,
  unpickItemAsFavoriteSuccess,
  UNPICK_ITEM_AS_FAVORITE_FAILURE,
  UNPICK_ITEM_AS_FAVORITE_REQUEST,
  UNPICK_ITEM_AS_FAVORITE_SUCCESS,
  fetchListsRequest,
  FETCH_LISTS_REQUEST,
  FETCH_LISTS_SUCCESS,
  FETCH_LISTS_FAILURE,
  fetchListsFailure,
  fetchListsSuccess
} from './actions'
import { List, Permission } from './types'

const itemBrowseOptions: ItemBrowseOptions = {
  view: View.LISTS,
  page: 0
}

const item = {
  id: 'anAddress-anItemId',
  name: 'aName',
  contractAddress: 'anAddress',
  itemId: 'anItemId',
  price: '1500000000000000000000',
  network: Network.ETHEREUM
} as Item

const list: List = {
  id: 'aListId',
  name: 'aListName',
  description: 'aDescription',
  userAddress: 'anOwnerAddress',
  createdAt: Date.now(),
  permission: Permission.VIEW
}

const createdAt: Record<string, number> = { [item.id]: Date.now() }
const total = 1

const anErrorMessage = 'An error'

describe('when creating the action to signal the start of the pick item as favorite request', () => {
  it('should return an object representing the action', () => {
    expect(pickItemAsFavoriteRequest(item)).toEqual({
      type: PICK_ITEM_AS_FAVORITE_REQUEST,
      meta: undefined,
      payload: { item }
    })
  })
})

describe('when creating the action to signal a successful pick item as favorite request', () => {
  it('should return an object representing the action', () => {
    expect(pickItemAsFavoriteSuccess(item)).toEqual({
      type: PICK_ITEM_AS_FAVORITE_SUCCESS,
      meta: undefined,
      payload: {
        item
      }
    })
  })
})

describe('when creating the action to signal a failure in the pick item as favorite request', () => {
  it('should return an object representing the action', () => {
    expect(pickItemAsFavoriteFailure(item, anErrorMessage)).toEqual({
      type: PICK_ITEM_AS_FAVORITE_FAILURE,
      meta: undefined,
      payload: { item, error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal the cancel of a pick item as favorite', () => {
  it('should return an object representing the action', () => {
    expect(cancelPickItemAsFavorite()).toEqual({
      type: CANCEL_PICK_ITEM_AS_FAVORITE,
      meta: undefined,
      payload: undefined
    })
  })
})

describe('when creating the action to signal the start of the unpick item as favorite request', () => {
  it('should return an object representing the action', () => {
    expect(unpickItemAsFavoriteRequest(item)).toEqual({
      type: UNPICK_ITEM_AS_FAVORITE_REQUEST,
      meta: undefined,
      payload: { item }
    })
  })
})

describe('when creating the action to signal a successful unpick item as favorite request', () => {
  it('should return an object representing the action', () => {
    expect(unpickItemAsFavoriteSuccess(item)).toEqual({
      type: UNPICK_ITEM_AS_FAVORITE_SUCCESS,
      meta: undefined,
      payload: {
        item
      }
    })
  })
})

describe('when creating the action to signal a failure in the unpick item as favorite request', () => {
  it('should return an object representing the action', () => {
    expect(unpickItemAsFavoriteFailure(item, anErrorMessage)).toEqual({
      type: UNPICK_ITEM_AS_FAVORITE_FAILURE,
      meta: undefined,
      payload: { item, error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal the start of the undo unpicking item as favorite request', () => {
  it('should return an object representing the action', () => {
    expect(undoUnpickingItemAsFavoriteRequest(item)).toEqual({
      type: UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST,
      meta: undefined,
      payload: { item }
    })
  })
})

describe('when creating the action to signal a successful undo unpicking item as favorite request', () => {
  it('should return an object representing the action', () => {
    expect(undoUnpickingItemAsFavoriteSuccess(item)).toEqual({
      type: UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS,
      meta: undefined,
      payload: {
        item
      }
    })
  })
})

describe('when creating the action to signal a failure in the undo unpicking item as favorite request', () => {
  it('should return an object representing the action', () => {
    expect(undoUnpickingItemAsFavoriteFailure(item, anErrorMessage)).toEqual({
      type: UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE,
      meta: undefined,
      payload: { item, error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal the start of the fetch favorited items request', () => {
  it('should return an object representing the action', () => {
    expect(fetchFavoritedItemsRequest(itemBrowseOptions, true)).toEqual({
      type: FETCH_FAVORITED_ITEMS_REQUEST,
      meta: undefined,
      payload: { options: itemBrowseOptions, forceLoadMore: true }
    })
  })
})

describe('when creating the action to signal a successful fetch favorited items request', () => {
  it('should return an object representing the action', () => {
    expect(
      fetchFavoritedItemsSuccess([item], createdAt, total, {}, 0, true)
    ).toEqual({
      type: FETCH_FAVORITED_ITEMS_SUCCESS,
      meta: undefined,
      payload: {
        items: [item],
        options: {},
        createdAt,
        total,
        timestamp: 0,
        forceLoadMore: true
      }
    })
  })
})

describe('when creating the action to signal a failure in the fetch favorited items request', () => {
  it('should return an object representing the action', () => {
    expect(fetchFavoritedItemsFailure(anErrorMessage)).toEqual({
      type: FETCH_FAVORITED_ITEMS_FAILURE,
      meta: undefined,
      payload: { error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal the start of the fetch lists request', () => {
  it('should return an object representing the action', () => {
    expect(fetchListsRequest(itemBrowseOptions)).toEqual({
      type: FETCH_LISTS_REQUEST,
      meta: undefined,
      payload: { options: itemBrowseOptions }
    })
  })
})

describe('when creating the action to signal a failure in the fetch lists request', () => {
  it('should return an object representing the action', () => {
    expect(fetchListsFailure(anErrorMessage)).toEqual({
      type: FETCH_LISTS_FAILURE,
      meta: undefined,
      payload: { error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal a successful fetch lists request', () => {
  it('should return an object representing the action', () => {
    expect(fetchListsSuccess([list], total, itemBrowseOptions)).toEqual({
      type: FETCH_LISTS_SUCCESS,
      meta: undefined,
      payload: { lists: [list], total, options: itemBrowseOptions }
    })
  })
})
