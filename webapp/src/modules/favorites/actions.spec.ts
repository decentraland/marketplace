import { Item, Network } from '@dcl/schemas'
import { ItemBrowseOptions } from '../item/types'
import { View } from '../ui/types'
import {
  ListDetails,
  ListOfLists,
  Permission,
  UpdateOrCreateList
} from '../vendor/decentraland/favorites/types'
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
  fetchListsSuccess,
  deleteListRequest,
  DELETE_LIST_REQUEST,
  deleteListFailure,
  DELETE_LIST_FAILURE,
  DELETE_LIST_SUCCESS,
  deleteListSuccess,
  GET_LIST_FAILURE,
  GET_LIST_REQUEST,
  GET_LIST_SUCCESS,
  getListFailure,
  getListRequest,
  getListSuccess,
  UPDATE_LIST_FAILURE,
  UPDATE_LIST_REQUEST,
  UPDATE_LIST_SUCCESS,
  updateListFailure,
  updateListRequest,
  updateListSuccess,
  CREATE_LIST_REQUEST,
  CREATE_LIST_FAILURE,
  CREATE_LIST_SUCCESS,
  createListFailure,
  createListRequest,
  createListSuccess,
  CREATE_LIST_CLEAR,
  createListClear,
  bulkPickUnpickRequest,
  bulkPickUnpickSuccess,
  bulkPickUnpickFailure,
  BULK_PICK_REQUEST,
  BULK_PICK_SUCCESS,
  BULK_PICK_FAILURE,
  BULK_PICK_START,
  bulkPickUnpickStart,
  bulkPickUnpickCancel,
  BULK_PICK_CANCEL
} from './actions'
import { CreateListParameters, List, ListsBrowseOptions } from './types'

const itemBrowseOptions: ItemBrowseOptions = {
  view: View.LISTS,
  page: 0
}

const listsBrowseOptions: ListsBrowseOptions = {
  page: 1,
  first: 10
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
  itemsCount: 1,
  createdAt: Date.now(),
  permission: Permission.VIEW
}

const listOfLists: ListOfLists = {
  id: 'aListId',
  name: 'aListName',
  itemsCount: 1,
  previewOfItemIds: [item.id],
  isPrivate: true
}

const createList: CreateListParameters = {
  name: 'aListName',
  description: 'aDescription',
  isPrivate: true
}

const createOrUpdateList: UpdateOrCreateList = {
  id: 'aListId',
  name: 'aListName',
  description: 'aDescription',
  userAddress: 'anOwnerAddress',
  createdAt: Date.now(),
  updatedAt: null,
  permission: Permission.VIEW,
  isPrivate: true
}

const listDetails: ListDetails = {
  ...createOrUpdateList,
  itemsCount: 1
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
    expect(fetchListsRequest(listsBrowseOptions)).toEqual({
      type: FETCH_LISTS_REQUEST,
      meta: undefined,
      payload: { options: listsBrowseOptions }
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
    expect(
      fetchListsSuccess([listOfLists], [item], total, listsBrowseOptions)
    ).toEqual({
      type: FETCH_LISTS_SUCCESS,
      meta: undefined,
      payload: {
        lists: [listOfLists],
        items: [item],
        total,
        options: listsBrowseOptions
      }
    })
  })
})

describe('when creating the action to signal the start of the delete list request', () => {
  it('should return an object representing the action', () => {
    expect(deleteListRequest(list)).toEqual({
      type: DELETE_LIST_REQUEST,
      meta: undefined,
      payload: { list }
    })
  })
})

describe('when creating the action to signal a failure in the delete list request', () => {
  it('should return an object representing the action', () => {
    expect(deleteListFailure(list, anErrorMessage)).toEqual({
      type: DELETE_LIST_FAILURE,
      meta: undefined,
      payload: { list, error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal a successful delete list request', () => {
  it('should return an object representing the action', () => {
    expect(deleteListSuccess(list)).toEqual({
      type: DELETE_LIST_SUCCESS,
      meta: undefined,
      payload: { list }
    })
  })
})

describe('when creating the action to signal the start of the get list request', () => {
  it('should return an object representing the action', () => {
    expect(getListRequest(list.id)).toEqual({
      type: GET_LIST_REQUEST,
      meta: undefined,
      payload: { id: list.id }
    })
  })
})

describe('when creating the action to signal a failure in the get list request', () => {
  it('should return an object representing the action', () => {
    expect(getListFailure(list.id, anErrorMessage)).toEqual({
      type: GET_LIST_FAILURE,
      meta: undefined,
      payload: { id: list.id, error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal a successful get list request', () => {
  it('should return an object representing the action', () => {
    expect(getListSuccess(listDetails)).toEqual({
      type: GET_LIST_SUCCESS,
      meta: undefined,
      payload: { list: listDetails }
    })
  })
})

describe('when creating the action to signal the start of the update list request', () => {
  it('should return an object representing the action', () => {
    expect(updateListRequest(list.id, createList)).toEqual({
      type: UPDATE_LIST_REQUEST,
      meta: undefined,
      payload: { id: list.id, updatedList: createList }
    })
  })
})

describe('when creating the action to signal a failure in the update list request', () => {
  it('should return an object representing the action', () => {
    expect(updateListFailure(list.id, anErrorMessage)).toEqual({
      type: UPDATE_LIST_FAILURE,
      meta: undefined,
      payload: { id: list.id, error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal a successful update list request', () => {
  it('should return an object representing the action', () => {
    expect(updateListSuccess(createOrUpdateList)).toEqual({
      type: UPDATE_LIST_SUCCESS,
      meta: undefined,
      payload: { list: createOrUpdateList }
    })
  })
})

describe('when creating the action to signal the start of the create list request', () => {
  it('should return an object representing the action', () => {
    expect(createListRequest(createList)).toEqual({
      type: CREATE_LIST_REQUEST,
      meta: undefined,
      payload: createList
    })
  })
})

describe('when creating the action to signal a failure in the create list request', () => {
  it('should return an object representing the action', () => {
    expect(createListFailure(anErrorMessage)).toEqual({
      type: CREATE_LIST_FAILURE,
      meta: undefined,
      payload: { error: anErrorMessage }
    })
  })
})

describe('when creating the action to signal a successful create list request', () => {
  it('should return an object representing the action', () => {
    expect(createListSuccess(createOrUpdateList)).toEqual({
      type: CREATE_LIST_SUCCESS,
      meta: undefined,
      payload: { list: createOrUpdateList }
    })
  })
})

describe('when creating the action to signal a create list clear', () => {
  it('should return an object representing the action', () => {
    expect(createListClear()).toEqual({
      type: CREATE_LIST_CLEAR,
      meta: undefined,
      payload: undefined
    })
  })
})

describe('when creating the action to signal the start the bulk item pick-unpick process', () => {
  it('should return an object representing the action', () => {
    expect(bulkPickUnpickStart(item)).toEqual({
      type: BULK_PICK_START,
      meta: undefined,
      payload: {
        item
      }
    })
  })
})

describe('when creating the action to signal the start of the bulk item pick-unpick request', () => {
  it('should return an object representing the action', () => {
    expect(bulkPickUnpickRequest(item, [listOfLists], [])).toEqual({
      type: BULK_PICK_REQUEST,
      meta: undefined,
      payload: {
        item,
        pickedFor: [listOfLists],
        unpickedFrom: []
      }
    })
  })
})

describe('when creating the action to signal a successful bulk item pick-unpick request', () => {
  it('should return an object representing the action', () => {
    expect(bulkPickUnpickSuccess(item, [listOfLists], [], true, false)).toEqual(
      {
        type: BULK_PICK_SUCCESS,
        meta: undefined,
        payload: {
          item,
          pickedFor: [listOfLists],
          unpickedFrom: [],
          isPickedByUser: true,
          ownerRemovedFromCurrentList: false
        }
      }
    )
  })
})

describe('when creating the action to signal a failure in the bulk item pick-unpick request', () => {
  it('should return an object representing the action', () => {
    expect(
      bulkPickUnpickFailure(item, [listOfLists], [], anErrorMessage)
    ).toEqual({
      type: BULK_PICK_FAILURE,
      meta: undefined,
      payload: {
        item,
        pickedFor: [listOfLists],
        unpickedFrom: [],
        error: anErrorMessage
      }
    })
  })
})

describe('when creating the action to signal the cancel of the bulk item pick-unpick process', () => {
  it('should return an object representing the action without errors', () => {
    expect(bulkPickUnpickCancel(item)).toEqual({
      type: BULK_PICK_CANCEL,
      meta: undefined,
      payload: {
        item
      }
    })
  })

  it('should return an object representing the action with an error', () => {
    const error = 'An Error'
    expect(bulkPickUnpickCancel(item, error)).toEqual({
      type: BULK_PICK_CANCEL,
      meta: undefined,
      payload: {
        item,
        error
      }
    })
  })
})
