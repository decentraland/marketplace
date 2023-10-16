import { getLocation, push } from 'connected-react-router'
import { call, put, select, take } from 'redux-saga/effects'
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
import { locations } from '../routing/locations'
import { SortDirection } from '../routing/types'
import { CatalogAPI } from '../vendor/decentraland/catalog/api'
import { getIsMarketplaceServerEnabled } from '../features/selectors'
import { getData as getItemsData } from '../item/selectors'
import {
  BULK_PICK_SUCCESS,
  CREATE_LIST_SUCCESS,
  bulkPickUnpickCancel,
  bulkPickUnpickFailure,
  bulkPickUnpickRequest,
  bulkPickUnpickStart,
  bulkPickUnpickSuccess,
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
  pickItemFailure,
  pickItemSuccess,
  unpickItemFailure,
  unpickItemSuccess,
  updateListFailure,
  updateListRequest,
  updateListSuccess
} from './actions'
import { favoritesSaga } from './sagas'
import {
  getList,
  getListId,
  isOwnerUnpickingFromCurrentList
} from './selectors'
import { convertListsBrowseSortByIntoApiSortBy } from './utils'
import {
  CreateListParameters,
  FavoritedItems,
  List,
  ListsBrowseOptions,
  ListsBrowseSortBy,
  UpdateListParameters
} from './types'

let item: Item
let address: string
let error: Error

const getIdentity = () => undefined

beforeEach(() => {
  error = new Error('error')
  item = { id: 'anAddress-itemId', itemId: 'itemId' } as Item
  address = '0xb549b2442b2bd0a53795bc5cdcbfe0caf7aca9f8'
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

  describe('and getting the address fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getListId), listId],
          [select(getAddress), Promise.reject(error)],
          [select(getIsMarketplaceServerEnabled), true]
        ])
        .put(fetchFavoritedItemsFailure(error.message))
        .dispatch(fetchFavoritedItemsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getListId), listId],
          [select(getAddress), address],
          [select(getIsMarketplaceServerEnabled), true],
          [call(getAccountIdentity), Promise.reject(error)]
        ])
        .put(fetchFavoritedItemsFailure(error.message))
        .dispatch(fetchFavoritedItemsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the user is logged in', () => {
    describe('and the call to the favorites api fails', () => {
      it('should dispatch an action signaling the failure of the handled action', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [select(getListId), listId],
            [select(getAddress), address],
            [select(getIsMarketplaceServerEnabled), true],
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
      let isMarketplaceFFOn: boolean

      describe("and there's more than one favorited item", () => {
        beforeEach(() => {
          favoritedItemIds = [{ itemId: item.id, createdAt: Date.now() }]
          createdAt = { [item.id]: favoritedItemIds[0].createdAt }
          total = 1
        })

        describe('and the marketplace-server flag is off', () => {
          beforeEach(() => {
            isMarketplaceFFOn = false
          })
          describe('and the call to the items api fails', () => {
            it('should dispatch an action signaling the failure of the handled action', () => {
              return expectSaga(favoritesSaga, getIdentity)
                .provide([
                  [select(getListId), listId],
                  [select(getIsMarketplaceServerEnabled), isMarketplaceFFOn],
                  [select(getAddress), address],
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
        })

        describe('and the marketplace-server flag is on', () => {
          beforeEach(() => {
            isMarketplaceFFOn = true
          })
          describe('and the call to the items api fails', () => {
            it('should dispatch an action signaling the failure of the handled action', () => {
              return expectSaga(favoritesSaga, getIdentity)
                .provide([
                  [select(getListId), listId],
                  [select(getIsMarketplaceServerEnabled), isMarketplaceFFOn],
                  [select(getAddress), address],
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
                [select(getAddress), address],
                [select(getIsMarketplaceServerEnabled), true],
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
              [select(getAddress), address],
              [select(getIsMarketplaceServerEnabled), true],
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

  describe('and the user is not logged in', () => {
    describe('and the call to the favorites api fails', () => {
      it('should dispatch an action signaling the failure of the handled action', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [select(getListId), listId],
            [select(getAddress), null],
            [select(getIsMarketplaceServerEnabled), true],
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

      describe("and there's more than one favorited item", () => {
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
                [select(getAddress), null],
                [select(getIsMarketplaceServerEnabled), true],
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
                [select(getAddress), null],
                [select(getIsMarketplaceServerEnabled), true],
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
              [select(getAddress), null],
              [select(getIsMarketplaceServerEnabled), true],
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
          previewOfItemIds: ['anItemId'],
          isPrivate: true
        },
        {
          id: 'anotherId',
          name: 'anotherName',
          itemsCount: 1,
          previewOfItemIds: ['anotherItemId'],
          isPrivate: true
        }
      ]
      total = 2
    })

    describe('and all the preview items are different', () => {
      describe('and the call to the catalog api succeeds', () => {
        let items: Item[]

        beforeEach(() => {
          items = [
            { id: 'anItemId', name: 'anItemName' } as Item,
            { id: 'anotherItemId', name: 'anotherItemName' } as Item
          ]
        })

        describe('and there are no items in the state', () => {
          it('should dispatch an action signaling the success of the handled action', () => {
            return expectSaga(favoritesSaga, getIdentity)
              .provide([
                [call(getAccountIdentity), Promise.resolve()],
                [select(getIsMarketplaceServerEnabled), true],
                [
                  matchers.call.fn(FavoritesAPI.prototype.getLists),
                  Promise.resolve({ results: lists, total })
                ],
                [select(getItemsData), {}],
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

        describe('and there are already some items in the sate', () => {
          it('should dispatch an action signaling the success of the handled action', () => {
            return expectSaga(favoritesSaga, getIdentity)
              .provide([
                [call(getAccountIdentity), Promise.resolve()],
                [select(getIsMarketplaceServerEnabled), true],
                [
                  matchers.call.fn(FavoritesAPI.prototype.getLists),
                  Promise.resolve({ results: lists, total })
                ],
                [select(getItemsData), { anItemId: items[0] }],
                [
                  matchers.call.fn(CatalogAPI.prototype.get),
                  Promise.resolve({ data: [items[1]] })
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
                    first: 1,
                    ids: ['anotherItemId']
                  }
                ]
              })
              .put(fetchListsSuccess(lists, [items[1]], total, options))
              .dispatch(fetchListsRequest(options))
              .run({ silenceTimeout: true })
          })
        })

        describe('and there are already all the items in the state', () => {
          it('should dispatch an action signaling the success of the handled action without fetching the catalog items', () => {
            return expectSaga(favoritesSaga, getIdentity)
              .provide([
                [call(getAccountIdentity), Promise.resolve()],
                [
                  matchers.call.fn(FavoritesAPI.prototype.getLists),
                  Promise.resolve({ results: lists, total })
                ],
                [
                  select(getItemsData),
                  { [items[0].id]: items[0], [items[1].id]: items[1] }
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
              .not.call.like({
                fn: CatalogAPI.prototype.get
              })
              .put(fetchListsSuccess(lists, [], total, options))
              .dispatch(fetchListsRequest(options))
              .run({ silenceTimeout: true })
          })
        })
      })
    })

    describe('and there are different lists with at least the same preview item', () => {
      describe('and the call to the catalog api succeeds', () => {
        let items: Item[]

        beforeEach(() => {
          lists = [
            {
              ...lists[0],
              previewOfItemIds: ['anItemId', 'anotherItemId']
            },
            {
              ...lists[1],
              previewOfItemIds: ['anotherItemId']
            }
          ]
          items = [
            { id: 'anItemId', name: 'anItemName' } as Item,
            { id: 'anotherItemId', name: 'anotherItemName' } as Item
          ]
        })

        it('should dispatch an action signaling the success of the handled action', () => {
          return expectSaga(favoritesSaga, getIdentity)
            .provide([
              [call(getAccountIdentity), Promise.resolve()],
              [select(getIsMarketplaceServerEnabled), true],
              [
                matchers.call.fn(FavoritesAPI.prototype.getLists),
                Promise.resolve({ results: lists, total })
              ],
              [select(getItemsData), {}],
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
                  ids: Array.from(
                    new Set([
                      ...lists[0].previewOfItemIds,
                      ...lists[1].previewOfItemIds
                    ])
                  )
                }
              ]
            })
            .put(fetchListsSuccess(lists, items, total, options))
            .dispatch(fetchListsRequest(options))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('and the call to the catalog api fails', () => {
      it('should dispatch an action signaling the failure of the handled action', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [call(getAccountIdentity), Promise.resolve()],
            [select(getIsMarketplaceServerEnabled), true],
            [
              matchers.call.fn(FavoritesAPI.prototype.getLists),
              Promise.resolve({ results: lists, total })
            ],
            [select(getItemsData), {}],
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
          ],
          [select(getLocation), { pathname: locations.lists() }]
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

describe('when handling the success deletion of a list', () => {
  let list: List
  beforeEach(() => {
    list = { id: 'anId', name: 'aName', itemsCount: 1, createdAt: Date.now() }
  })

  describe('and the user performed the action from the list detail page', () => {
    it('should dispatch an action to redirect the user to the My Lists tab', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[select(getLocation), { pathname: locations.list(list.id) }]])
        .put(push(locations.lists()))
        .dispatch(deleteListSuccess(list))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the user performed the action from the My Lists tab', () => {
    it('should not dispatch the action signaling the redirection', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[select(getLocation), { pathname: locations.lists() }]])
        .not.put(push(locations.lists()))
        .dispatch(deleteListSuccess(list))
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
      permission: Permission.VIEW,
      isPrivate: false,
      previewOfItemIds: ['anItemId']
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
    let items: Item[]

    beforeEach(() => {
      items = [
        {
          id: 'anItemId',
          name: 'anItemName'
        } as Item
      ]
    })

    describe('and non of the preview items are already in the state', () => {
      it('should dispatch an action signaling the success of the handled action with the received list and items', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [
              matchers.call.fn(FavoritesAPI.prototype.getList),
              Promise.resolve(list)
            ],
            [select(getIsMarketplaceServerEnabled), true],
            [select(getItemsData), {}],
            [
              matchers.call.fn(CatalogAPI.prototype.get),
              Promise.resolve({ data: items })
            ]
          ])
          .call.like({
            fn: FavoritesAPI.prototype.getList,
            args: [list.id]
          })
          .call.like({
            fn: CatalogAPI.prototype.get,
            args: [
              {
                first: 1,
                ids: list.previewOfItemIds
              }
            ]
          })
          .put(getListSuccess(list, items))
          .dispatch(getListRequest(list.id))
          .run({ silenceTimeout: true })
      })
    })

    describe('and some of the preview items are already in the state', () => {
      beforeEach(() => {
        items = [
          ...items,
          {
            id: 'anotherItemId',
            name: 'anotherItemName'
          } as Item
        ]
        list = { ...list, previewOfItemIds: ['anItemId', 'anotherItemId'] }
      })

      it('should dispatch an action signaling the success of the handled action with the received list and the items that are not in the state', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [
              matchers.call.fn(FavoritesAPI.prototype.getList),
              Promise.resolve(list)
            ],
            [select(getIsMarketplaceServerEnabled), true],
            [select(getItemsData), { anotherItemId: {} }],
            [
              matchers.call.fn(CatalogAPI.prototype.get),
              Promise.resolve({ data: items })
            ]
          ])
          .call.like({
            fn: FavoritesAPI.prototype.getList,
            args: [list.id]
          })
          .call.like({
            fn: CatalogAPI.prototype.get,
            args: [
              {
                first: 1,
                ids: ['anItemId']
              }
            ]
          })
          .put(getListSuccess(list, items))
          .dispatch(getListRequest(list.id))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the request for updating a list', () => {
  let listToUpdate: UpdateListParameters
  let updatedList: UpdateOrCreateList

  beforeEach(() => {
    listToUpdate = {
      name: 'aName',
      description: 'aDescription',
      isPrivate: false
    }
    updatedList = {
      id: 'anId',
      name: 'aName',
      description: 'aDescription',
      userAddress: 'aUserAddress',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      permission: Permission.VIEW,
      isPrivate: false,
      previewOfItemIds: []
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
          args: [updatedList.id, listToUpdate]
        })
        .put(updateListFailure(updatedList.id, error.message))
        .dispatch(updateListRequest(updatedList.id, listToUpdate))
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
          args: [updatedList.id, listToUpdate]
        })
        .put(updateListSuccess(updatedList))
        .dispatch(updateListRequest(updatedList.id, listToUpdate))
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
      updatedAt: null,
      isPrivate: false,
      previewOfItemIds: []
    }
  })

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getLocation), { pathname: locations.lists() }],
          [call(getAccountIdentity), Promise.reject(error)]
        ])
        .put(createListFailure(error.message))
        .dispatch(createListRequest(listToCreate))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getLocation), { pathname: locations.lists() }],
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
    describe('and the current path is the lists one', () => {
      it('should dispatch an action signaling the success of the handled action and a push to the created list page', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [select(getLocation), { pathname: locations.lists() }],
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
          .put(push(locations.list(returnedList.id)))
          .dispatch(createListRequest(listToCreate))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the current path is not the lists one', () => {
      it('should dispatch an action signaling the success of the handled action without a push to the created list page', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [select(getLocation), { pathname: locations.browse() }],
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
          .not.put(push(locations.list(returnedList.id)))
          .dispatch(createListRequest(listToCreate))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the request to start the picks and unpicks in bulk process', () => {
  let newList: ListOfLists

  beforeEach(() => {
    newList = {
      id: 'anId',
      name: 'aName',
      itemsCount: 1,
      previewOfItemIds: ['anItemId'],
      isPrivate: true
    }
  })

  describe('and getting the address fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[select(getAddress), throwError(error)]])
        .put(bulkPickUnpickCancel(item, error.message))
        .dispatch(bulkPickUnpickStart(item))
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
              [call(getAccountIdentity), Promise.resolve()]
            ])
            .put(openModal('LoginModal'))
            .put(closeModal('LoginModal'))
            .put(openModal('SaveToListModal', { item }))
            .dispatch(bulkPickUnpickStart(item))
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
            .put(bulkPickUnpickCancel(item))
            .dispatch(bulkPickUnpickStart(item))
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
        .put(bulkPickUnpickCancel(item, error.message))
        .dispatch(bulkPickUnpickStart(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the user picks or unpicks in bulk without trying to create a new list', () => {
    it('should end the saga without dispatching a bulk request', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [select(getAddress), address],
          [call(getAccountIdentity), Promise.resolve()],
          [take(BULK_PICK_SUCCESS), { payload: { list: newList } }]
        ])
        .put(openModal('SaveToListModal', { item }))
        .not.put(closeModal('SaveToListModal'))
        .not.put(bulkPickUnpickRequest(item, [newList], []))
        .dispatch(bulkPickUnpickStart(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the user tries to create a new list', () => {
    describe('and the creation of the list succeeds', () => {
      it('should dispatch an action signaling the pick item in bulk request for the created list', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [select(getAddress), address],
            [call(getAccountIdentity), Promise.resolve()],
            [take(CREATE_LIST_SUCCESS), { payload: { list: newList } }],
            [select(getList, newList.id), newList],
            [put(bulkPickUnpickRequest(item, [newList], [])), undefined]
          ])
          .put(openModal('SaveToListModal', { item }))
          .put(closeModal('SaveToListModal'))
          .put(bulkPickUnpickRequest(item, [newList], []))
          .dispatch(bulkPickUnpickStart(item))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the user closes the creation list modal', () => {
      it('should dispatch an action signaling the cancel of the pick item in bulk process', () => {
        return expectSaga(favoritesSaga, getIdentity)
          .provide([
            [select(getAddress), address],
            [call(getAccountIdentity), Promise.resolve()],
            [take(CLOSE_MODAL), {}],
            [put(bulkPickUnpickRequest(item, [newList], [])), undefined]
          ])
          .put(openModal('SaveToListModal', { item }))
          .not.put(bulkPickUnpickRequest(item, [newList], []))
          .dispatch(bulkPickUnpickStart(item))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the request to perform picks and unpicks in bulk', () => {
  let fstList: ListOfLists
  let sndList: ListOfLists

  beforeEach(() => {
    fstList = {
      id: 'anId',
      name: 'aName',
      itemsCount: 1,
      previewOfItemIds: ['anItemId'],
      isPrivate: true
    }
    sndList = {
      id: 'anotherId',
      name: 'anotherName',
      itemsCount: 2,
      previewOfItemIds: ['anotherItemId'],
      isPrivate: true
    }
  })

  describe('and getting the identity fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([[call(getAccountIdentity), Promise.reject(error)]])
        .put(bulkPickUnpickFailure(item, [fstList], [sndList], error.message))
        .dispatch(bulkPickUnpickRequest(item, [fstList], [sndList]))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the call to the favorites api fails', () => {
    it('should dispatch an action signaling the failure of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [
            matchers.call.fn(FavoritesAPI.prototype.bulkPickUnpick),
            Promise.reject(error)
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.bulkPickUnpick,
          args: [item.id, [fstList.id], [sndList.id]]
        })
        .put(bulkPickUnpickFailure(item, [fstList], [sndList], error.message))
        .dispatch(bulkPickUnpickRequest(item, [fstList], [sndList]))
        .run({ silenceTimeout: true })
    })
  })

  describe('and call to the favorites api succeeds', () => {
    it('should dispatch an action signaling the success of the handled action', () => {
      return expectSaga(favoritesSaga, getIdentity)
        .provide([
          [call(getAccountIdentity), Promise.resolve()],
          [select(isOwnerUnpickingFromCurrentList, [sndList]), true],
          [
            matchers.call.fn(FavoritesAPI.prototype.bulkPickUnpick),
            Promise.resolve({ pickedByUser: true })
          ]
        ])
        .call.like({
          fn: FavoritesAPI.prototype.bulkPickUnpick,
          args: [item.id, [fstList.id], [sndList.id]]
        })
        .put(bulkPickUnpickSuccess(item, [fstList], [sndList], true, true))
        .dispatch(bulkPickUnpickRequest(item, [fstList], [sndList]))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the success of the bulk pick and unpick process', () => {
  let fstList: ListOfLists
  let sndList: ListOfLists

  beforeEach(() => {
    fstList = {
      id: 'anId',
      name: 'aName',
      itemsCount: 1,
      previewOfItemIds: ['anItemId'],
      isPrivate: true
    }
    sndList = {
      id: 'anotherId',
      name: 'anotherName',
      itemsCount: 2,
      previewOfItemIds: ['anotherItemId'],
      isPrivate: true
    }
  })

  it('should dispatch a pick success action and an unpick success action for each picked or unpicked lists', () => {
    return expectSaga(favoritesSaga, getIdentity)
      .put(pickItemSuccess(item, fstList.id))
      .put(unpickItemSuccess(item, sndList.id))
      .dispatch(bulkPickUnpickSuccess(item, [fstList], [sndList], true, true))
      .run({ silenceTimeout: true })
  })
})

describe('when handling the failure of the bulk pick and unpick process', () => {
  let error: string
  let fstList: ListOfLists
  let sndList: ListOfLists

  beforeEach(() => {
    error = 'An error occurred'
    fstList = {
      id: 'anId',
      name: 'aName',
      itemsCount: 1,
      previewOfItemIds: ['anItemId'],
      isPrivate: true
    }
    sndList = {
      id: 'anotherId',
      name: 'anotherName',
      itemsCount: 2,
      previewOfItemIds: ['anotherItemId'],
      isPrivate: true
    }
  })

  it('should dispatch a pick failure action and an unpick success action for each picked or unpicked lists', () => {
    return expectSaga(favoritesSaga, getIdentity)
      .put(pickItemFailure(item, fstList.id, error))
      .put(unpickItemFailure(item, sndList.id, error))
      .dispatch(bulkPickUnpickFailure(item, [fstList], [sndList], error))
      .run({ silenceTimeout: true })
  })
})
