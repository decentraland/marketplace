import { call, select, take } from 'redux-saga/effects'
import * as matchers from 'redux-saga-test-plan/matchers'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { Item } from '@dcl/schemas'
import { CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import { closeModal, CLOSE_MODAL, openModal } from '../modal/actions'
import { FavoritesAPI } from '../vendor/decentraland/favorites/api'
import { getAddress } from '../wallet/selectors'
import { ItemBrowseOptions } from '../item/types'
import { View } from '../ui/types'
import { getIdentity as getAccountIdentity } from '../identity/utils'
import { ItemAPI } from '../vendor/decentraland/item/api'
import {
  ListDetails,
  ListOfLists,
  ListsSortBy,
  Permission,
  UpdateOrCreateList
} from '../vendor/decentraland/favorites/types'
import { SortDirection } from '../routing/types'
import { CatalogAPI } from '../vendor/decentraland/catalog/api'
import {
  cancelPickItemAsFavorite,
  createListFailure,
  createListRequest,
  createListSuccess,
  deleteListFailure,
  deleteListRequest,
  deleteListStart,
  deleteListSuccess,
  fetchFavoritedItemsFailure,
  fetchFavoritedItemsRequest,
  fetchFavoritedItemsSuccess,
  fetchListsFailure,
  fetchListsRequest,
  fetchListsSuccess,
  getListFailure,
  getListRequest,
  getListSuccess,
  pickItemAsFavoriteFailure,
  pickItemAsFavoriteRequest,
  pickItemAsFavoriteSuccess,
  undoUnpickingItemAsFavoriteFailure,
  undoUnpickingItemAsFavoriteRequest,
  undoUnpickingItemAsFavoriteSuccess,
  unpickItemAsFavoriteFailure,
  unpickItemAsFavoriteRequest,
  unpickItemAsFavoriteSuccess,
  updateListFailure,
  updateListRequest,
  updateListSuccess
} from './actions'
import { favoritesSaga } from './sagas'
import { getListId } from './selectors'
import {
  CreateListParameters,
  FavoritedItems,
  List,
  ListsBrowseOptions,
  ListsBrowseSortBy
} from './types'
import { convertListsBrowseSortByIntoApiSortBy } from './utils'

let item: Item
let address: string
let error: Error

const getIdentity = () => undefined

beforeEach(() => {
  error = new Error('error')
  item = { id: 'anAddress-itemId', itemId: 'itemId' } as Item
  address = '0xb549b2442b2bd0a53795bc5cdcbfe0caf7aca9f8'
})

describe('when handling the request for picking an item as favorite', () => {
  describe('and getting the address fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[select(getAddress), throwError(error)]])
        .put(pickItemAsFavoriteFailure(item, error.message))
        .dispatch(pickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and getting the address succeeds', () => {
    describe('and the user is not connected', () => {
      describe('and the user succeeds to connect the wallet', () => {
        it('should close the login modal after the success', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [select(getAddress), undefined],
              [take(CONNECT_WALLET_SUCCESS), {}],
              [call(getAccountIdentity), Promise.resolve()],
              [
                matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
                undefined
              ]
            ])
            .call.like({
              fn: FavoritesAPI.prototype.pickItemAsFavorite,
              args: [item.id]
            })
            .put(openModal('LoginModal'))
            .put(closeModal('LoginModal'))
            .put(pickItemAsFavoriteSuccess(item))
            .dispatch(pickItemAsFavoriteRequest(item))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the user closes the login modal', () => {
        it('should finish the saga', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [select(getAddress), undefined],
              [take(CLOSE_MODAL), {}]
            ])
            .put(openModal('LoginModal'))
            .put(cancelPickItemAsFavorite())
            .dispatch(pickItemAsFavoriteRequest(item))
            .run({ silenceTimeout: true })
            .then(({ effects }) => {
              expect(effects.put).toBeUndefined()
            })
        })
      })
    })
  })

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getAddress), address],
          [call(getAccountIdentity), Promise.reject(error)]
        ])
        .put(pickItemAsFavoriteFailure(item, error.message))
        .dispatch(pickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getAddress), address],
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.pickItemAsFavorite,
          args: [item.id]
        })
        .put(pickItemAsFavoriteFailure(item, error.message))
        .dispatch(pickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getAddress), address],
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
            undefined
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.pickItemAsFavorite,
          args: [item.id]
        })
        .put(pickItemAsFavoriteSuccess(item))
        .dispatch(pickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for unpicking a favorite item', () => {
  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[call(getAccountIdentity), Promise.reject(error)]])
        .put(unpickItemAsFavoriteFailure(item, error.message))
        .dispatch(unpickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.unpickItemAsFavorite),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.unpickItemAsFavorite,
          args: [item.id]
        })
        .put(unpickItemAsFavoriteFailure(item, error.message))
        .dispatch(unpickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.unpickItemAsFavorite),
            undefined
          ],
          [call(getAccountIdentity), Promise.resolve()],
          [matchers.put(unpickItemAsFavoriteSuccess(item)), undefined]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.unpickItemAsFavorite,
          args: [item.id]
        })
        .put(unpickItemAsFavoriteSuccess(item))
        .dispatch(unpickItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for undo unpicking a favorite item', () => {
  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[call(getAccountIdentity), Promise.reject(error)]])
        .put(undoUnpickingItemAsFavoriteFailure(item, error.message))
        .dispatch(undoUnpickingItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.pickItemAsFavorite,
          args: [item.id]
        })
        .put(undoUnpickingItemAsFavoriteFailure(item, error.message))
        .dispatch(undoUnpickingItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.pickItemAsFavorite),
            undefined
          ],
          [call(getAccountIdentity), Promise.resolve()]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.pickItemAsFavorite,
          args: [item.id]
        })
        .put(undoUnpickingItemAsFavoriteSuccess(item))
        .dispatch(undoUnpickingItemAsFavoriteRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for fetching favorited items', () => {
  let options: ItemBrowseOptions
  let listId: string

  beforeEach(() => {
    options = {
      view: View.LISTS,
      page: 0
    }
    listId = 'listId'
  })

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getListId), listId],
          [call(getAccountIdentity), Promise.reject(error)]
        ])
        .put(fetchFavoritedItemsFailure(error.message))
        .dispatch(fetchFavoritedItemsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getListId), listId],
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.getPicksByList,
          args: [listId, options.filters]
        })
        .put(fetchFavoritedItemsFailure(error.message))
        .dispatch(fetchFavoritedItemsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    let favoritedItemIds: FavoritedItems
    let createdAt: Record<string, number>
    let total: number

    describe("and there's more than favorited item", () => {
      beforeEach(() => {
        favoritedItemIds = [{ itemId: item.id, createdAt: Date.now() }]
        createdAt = { [item.id]: favoritedItemIds[0].createdAt }
        total = 1
      })

      describe('and the call to the items api fails', () => {
        it('should dispatch an action signaling the failure of the handled action', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [select(getListId), listId],
              [call(getAccountIdentity), Promise.resolve()],
              [
                matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
                Promise.resolve({ results: favoritedItemIds, total })
              ],
              [
                matchers.call.fn(CatalogAPI.prototype.get),
                Promise.reject(error)
              ]
            ])
            .call.like({
              fn: CatalogAPI.prototype.get,
              args: [
                {
                  ...options.filters,
                  first: 1,
                  ids: [favoritedItemIds[0].itemId]
                }
              ]
            })
            .put(fetchFavoritedItemsFailure(error.message))
            .dispatch(fetchFavoritedItemsRequest(options))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the call to the items api succeeds', () => {
        let currentTimestamp: number
        beforeEach(() => {
          total = 0
          currentTimestamp = Date.now()
          jest.spyOn(Date, 'now').mockReturnValueOnce(currentTimestamp)
        })

        it('should dispatch an action signaling the success of the handled action and the request of the retrieved items', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [select(getListId), listId],
              [call(getAccountIdentity), Promise.resolve()],
              [
                matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
                Promise.resolve({ results: favoritedItemIds, total })
              ],
              [
                matchers.call.fn(CatalogAPI.prototype.get),
                Promise.resolve({ data: [item] })
              ]
            ])
            .call.like({
              fn: FavoritesAPI.prototype.getPicksByList,
              args: [listId, options.filters]
            })
            .call.like({
              fn: CatalogAPI.prototype.get,
              args: [
                {
                  ...options.filters,
                  first: 1,
                  ids: [favoritedItemIds[0].itemId]
                }
              ]
            })
            .put(
              fetchFavoritedItemsSuccess(
                [item],
                createdAt,
                total,
                { ...options, filters: { ids: [item.id], first: 1 } },
                currentTimestamp
              )
            )
            .dispatch(fetchFavoritedItemsRequest(options))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('and there are no favorited items', () => {
      let currentTimestamp: number

      beforeEach(() => {
        favoritedItemIds = []
        total = 0
        currentTimestamp = Date.now()
        jest.spyOn(Date, 'now').mockReturnValueOnce(currentTimestamp)
      })

      it('should dispatch an action signaling the success of the handled action', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [select(getListId), listId],
            [call(getAccountIdentity), Promise.resolve()],
            [
              matchers.call.fn(FavoritesAPI.prototype.getPicksByList),
              { results: favoritedItemIds, total }
            ]
          ])
          .call.like({
            fn: FavoritesAPI.prototype.getPicksByList,
            args: [listId, options.filters]
          })
          .not.call.like({
            fn: ItemAPI.prototype.get,
            args: [options.filters]
          })
          .put(
            fetchFavoritedItemsSuccess(
              [],
              {},
              total,
              {
                ...options,
                filters: { first: favoritedItemIds.length, ids: [] }
              },
              currentTimestamp
            )
          )
          .dispatch(fetchFavoritedItemsRequest(options))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the request for fetching lists', () => {
  let options: ListsBrowseOptions

  beforeEach(() => {
    options = {
      page: 1,
      first: 24
    }
  })

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[call(getAccountIdentity), Promise.reject(error)]])
        .put(fetchListsFailure(error.message))
        .dispatch(fetchListsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.getLists),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.getLists,
          args: [
            {
              first: options.first,
              skip: (options.page - 1) * options.first,
              sortBy: undefined,
              sortDirection: undefined
            }
          ]
        })
        .put(fetchListsFailure(error.message))
        .dispatch(fetchListsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the sortBy by option is set', () => {
    let convertedSortBy: {
      sortBy: ListsSortBy
      sortDirection: SortDirection
    }

    beforeEach(() => {
      options.sortBy = ListsBrowseSortBy.NAME_ASC
      convertedSortBy = {
        sortBy: ListsSortBy.NAME,
        sortDirection: SortDirection.ASC
      }
    })

    it('should convert the sort by options and call the api with the sortBy and sortDirection options', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.getLists),
            Promise.reject(error)
          ],
          [
            call(
              convertListsBrowseSortByIntoApiSortBy,
              options.sortBy ?? ListsBrowseSortBy.NAME_ASC
            ),
            convertedSortBy
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.getLists,
          args: [
            {
              first: options.first,
              skip: (options.page - 1) * options.first,
              sortBy: convertedSortBy.sortBy,
              sortDirection: convertedSortBy.sortDirection
            }
          ]
        })
        .dispatch(fetchListsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the skip option is set', () => {
    beforeEach(() => {
      options.skip = 1
    })

    it('should call the api with the skip option', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.getLists),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.getLists,
          args: [
            {
              first: options.first,
              skip: options.skip,
              sortBy: undefined,
              sortDirection: undefined
            }
          ]
        })
        .dispatch(fetchListsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    let lists: ListOfLists[]
    let total: number

    beforeEach(() => {
      lists = [
        {
          id: 'anId',
          name: 'aName',
          itemsCount: 1,
          previewOfItemIds: ['anItemId']
        },
        {
          id: 'anotherId',
          name: 'anotherName',
          itemsCount: 1,
          previewOfItemIds: ['anotherItemId']
        }
      ]
      total = 2
    })

    describe('and the call to the catalog api succeeds', () => {
      let items: Item[]

      beforeEach(() => {
        items = [
          { id: 'anItemId', name: 'anItemName' } as Item,
          { id: 'anotherItemId', name: 'anotherItemName' } as Item
        ]
      })

      it('should dispatch an action signaling the success of the handled action', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [call(getAccountIdentity), Promise.resolve()],
            [
              matchers.call.fn(FavoritesAPI.prototype.getLists),
              Promise.resolve({ results: lists, total })
            ],
            [
              matchers.call.fn(CatalogAPI.prototype.get),
              Promise.resolve({ data: items })
            ]
          ])
          .call.like({
            fn: FavoritesAPI.prototype.getLists,
            args: [
              {
                first: options.first,
                skip: (options.page - 1) * options.first,
                sortBy: undefined,
                sortDirection: undefined
              }
            ]
          })
          .call.like({
            fn: CatalogAPI.prototype.get,
            args: [
              {
                first: 2,
                ids: [
                  ...lists[0].previewOfItemIds,
                  ...lists[1].previewOfItemIds
                ]
              }
            ]
          })
          .put(fetchListsSuccess(lists, items, total, options))
          .dispatch(fetchListsRequest(options))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the call to the catalog api fails', () => {
      it('should dispatch an action signaling the failure of the handled action', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [call(getAccountIdentity), Promise.resolve()],
            [
              matchers.call.fn(FavoritesAPI.prototype.getLists),
              Promise.resolve({ results: lists, total })
            ],
            [matchers.call.fn(CatalogAPI.prototype.get), Promise.reject(error)]
          ])
          .call.like({
            fn: FavoritesAPI.prototype.getLists,
            args: [
              {
                first: options.first,
                skip: (options.page - 1) * options.first,
                sortBy: undefined,
                sortDirection: undefined
              }
            ]
          })
          .call.like({
            fn: CatalogAPI.prototype.get,
            args: [
              {
                first: 2,
                ids: [
                  ...lists[0].previewOfItemIds,
                  ...lists[1].previewOfItemIds
                ]
              }
            ]
          })
          .put(fetchListsFailure(error.message))
          .dispatch(fetchListsRequest(options))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the start for deleting a list', () => {
  let list: List
  beforeEach(() => {
    list = {
      id: 'anId',
      name: 'aName',
      itemsCount: 1,
      description: 'aDescription',
      userAddress: 'aUserAddress',
      createdAt: Date.now()
    }
  })

  describe('and the list has items', () => {
    beforeEach(() => {
      list.itemsCount = 1
    })

    it('should only dispatch an action to open the delete list confirmation modal', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .put(openModal('ConfirmDeleteListModal', { list }))
        .not.put(deleteListRequest(list))
        .dispatch(deleteListStart(list))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the list has no items', () => {
    beforeEach(() => {
      list.itemsCount = 0
    })

    it('should only dispatch an action to start the deletion of the list', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[deleteListRequest(list), undefined]])
        .put(deleteListRequest(list))
        .not.put(openModal('ConfirmDeleteListModal', { list }))
        .dispatch(deleteListStart(list))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for deleting a list', () => {
  let list: List
  beforeEach(() => {
    list = {
      id: 'anId',
      name: 'aName',
      itemsCount: 1,
      description: 'aDescription',
      userAddress: 'aUserAddress',
      createdAt: Date.now()
    }
  })

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[call(getAccountIdentity), Promise.reject(error)]])
        .put(deleteListFailure(list, error.message))
        .dispatch(deleteListRequest(list))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.deleteList),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.deleteList,
          args: [list.id]
        })
        .put(deleteListFailure(list, error.message))
        .dispatch(deleteListRequest(list))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.deleteList),
            Promise.resolve()
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.deleteList,
          args: [list.id]
        })
        .put(deleteListSuccess(list))
        .dispatch(deleteListRequest(list))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for getting a list', () => {
  let list: ListDetails

  beforeEach(() => {
    list = {
      id: 'anId',
      name: 'aName',
      description: 'aDescription',
      userAddress: 'aUserAddress',
      itemsCount: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      permission: Permission.VIEW
    }
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.getList),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.getList,
          args: [list.id]
        })
        .put(getListFailure(list.id, error.message))
        .dispatch(getListRequest(list.id))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.getList),
            Promise.resolve(list)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.getList,
          args: [list.id]
        })
        .put(getListSuccess(list))
        .dispatch(getListRequest(list.id))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for updating a list', () => {
  let listToUpdate: List
  let updatedList: UpdateOrCreateList

  beforeEach(() => {
    listToUpdate = {
      id: 'anId',
      name: 'aName',
      description: 'aDescription',
      userAddress: 'aUserAddress',
      createdAt: Date.now(),
      itemsCount: 1
    }
    updatedList = {
      id: 'anId',
      name: 'aName',
      description: 'aDescription',
      userAddress: 'aUserAddress',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      permission: Permission.VIEW
    }
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.updateList),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.updateList,
          args: [listToUpdate.id, listToUpdate]
        })
        .put(updateListFailure(listToUpdate.id, error.message))
        .dispatch(updateListRequest(listToUpdate.id, listToUpdate))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(FavoritesAPI.prototype.updateList),
            Promise.resolve(updatedList)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.updateList,
          args: [listToUpdate.id, listToUpdate]
        })
        .put(updateListSuccess(updatedList))
        .dispatch(updateListRequest(listToUpdate.id, listToUpdate))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the request for creating a list', () => {
  let listToCreate: CreateListParameters
  let returnedList: UpdateOrCreateList

  beforeEach(() => {
    listToCreate = {
      name: 'aName',
      description: 'aDescription',
      isPrivate: false
    }
    returnedList = {
      id: 'anId',
      name: 'aName',
      description: 'aDescription',
      userAddress: 'aUserAddress',
      permission: Permission.EDIT,
      createdAt: Date.now(),
      updatedAt: null
    }
  })

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[call(getAccountIdentity), Promise.reject(error)]])
        .put(createListFailure(error.message))
        .dispatch(createListRequest(listToCreate))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.createList),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.createList,
          args: [listToCreate]
        })
        .put(createListFailure(error.message))
        .dispatch(createListRequest(listToCreate))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.createList),
            Promise.resolve(returnedList)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.createList,
          args: [listToCreate]
        })
        .put(createListSuccess(returnedList))
        .dispatch(createListRequest(listToCreate))
        .run({ silenceTimeout: true })
    })
  })
})
