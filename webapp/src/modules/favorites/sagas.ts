import { getLocation, push } from 'connected-react-router'
import { call, put, race, select, take, takeEvery } from 'redux-saga/effects'
import { CatalogFilters, Item } from '@dcl/schemas'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ConnectWalletSuccessAction, CONNECT_WALLET_FAILURE, CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import { isErrorWithMessage } from '../../lib/error'
import { ItemBrowseOptions } from '../item/types'
import { closeModal, CloseModalAction, CLOSE_MODAL, openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { FavoritesAPI, MARKETPLACE_FAVORITES_SERVER_URL } from '../vendor/decentraland/favorites/api'
import { getIdentity as getAccountIdentity } from '../identity/utils'
import { CatalogAPI } from '../vendor/decentraland/catalog/api'
import { retryParams } from '../vendor/decentraland/utils'
import { getAddress } from '../wallet/selectors'
import { MARKETPLACE_SERVER_URL, NFT_SERVER_URL } from '../vendor/decentraland'
import { locations } from '../routing/locations'
import { SortDirection } from '../routing/types'
import { ListsSortBy } from '../vendor/decentraland/favorites/types'
import {
  fetchFavoritedItemsFailure,
  FetchFavoritedItemsRequestAction,
  fetchFavoritedItemsSuccess,
  FETCH_FAVORITED_ITEMS_REQUEST,
  FETCH_LISTS_REQUEST,
  fetchListsFailure,
  fetchListsSuccess,
  FetchListsRequestAction,
  DeleteListRequestAction,
  deleteListFailure,
  deleteListSuccess,
  DELETE_LIST_REQUEST,
  GetListRequestAction,
  GET_LIST_REQUEST,
  getListFailure,
  getListSuccess,
  UpdateListRequestAction,
  UPDATE_LIST_REQUEST,
  updateListFailure,
  updateListSuccess,
  CreateListRequestAction,
  createListFailure,
  createListSuccess,
  CREATE_LIST_REQUEST,
  DeleteListStartAction,
  DELETE_LIST_START,
  deleteListRequest,
  BULK_PICK_REQUEST,
  BulkPickUnpickRequestAction,
  bulkPickUnpickFailure,
  bulkPickUnpickSuccess,
  BULK_PICK_START,
  BulkPickUnpickStartAction,
  bulkPickUnpickCancel,
  CreateListSuccessAction,
  CREATE_LIST_SUCCESS,
  bulkPickUnpickRequest,
  DELETE_LIST_SUCCESS,
  BulkPickUnpickSuccessAction,
  BulkPickUnpickFailureAction,
  BULK_PICK_SUCCESS,
  pickItemSuccess,
  unpickItemSuccess,
  pickItemFailure,
  unpickItemFailure,
  BULK_PICK_FAILURE
} from './actions'
import { getList, getListId, isOwnerUnpickingFromCurrentList } from './selectors'
import { convertListsBrowseSortByIntoApiSortBy } from './utils'
import { List } from './types'
import { getData as getItemsData } from '../item/selectors'
import { getIsMarketplaceServerEnabled } from '../features/selectors'

export function* favoritesSaga(getIdentity: () => AuthIdentity | undefined) {
  const API_OPTS = {
    retries: retryParams.attempts,
    retryDelay: retryParams.delay,
    identity: getIdentity
  }
  const favoritesAPI = new FavoritesAPI(MARKETPLACE_FAVORITES_SERVER_URL, API_OPTS)
  const catalogAPI = new CatalogAPI(NFT_SERVER_URL, API_OPTS)
  const marketplaceServerCatalogAPI = new CatalogAPI(MARKETPLACE_SERVER_URL, API_OPTS)

  yield takeEvery(FETCH_FAVORITED_ITEMS_REQUEST, handleFetchFavoritedItemsRequest)
  yield takeEvery(FETCH_LISTS_REQUEST, handleFetchListsRequest)
  yield takeEvery(DELETE_LIST_REQUEST, handleDeleteListRequest)
  yield takeEvery(DELETE_LIST_START, handleDeleteListStart)
  yield takeEvery(DELETE_LIST_SUCCESS, handleDeleteListSuccess)
  yield takeEvery(GET_LIST_REQUEST, handleGetListRequest)
  yield takeEvery(UPDATE_LIST_REQUEST, handleUpdateListRequest)
  yield takeEvery(CREATE_LIST_REQUEST, handleCreateListRequest)
  yield takeEvery(BULK_PICK_START, handleBulkPickStart)
  yield takeEvery(BULK_PICK_REQUEST, handleBulkPickRequest)
  yield takeEvery([BULK_PICK_SUCCESS, BULK_PICK_FAILURE], handleBulkPickSuccessOrFailure)

  function* getCatalogAPI() {
    const isMarketplaceServerEnabled: boolean = yield select(getIsMarketplaceServerEnabled)
    return isMarketplaceServerEnabled ? marketplaceServerCatalogAPI : catalogAPI
  }

  function* fetchPreviewItems(previewListsItemIds: string[]) {
    let previewItems: Item[] = []

    if (previewListsItemIds.length > 0) {
      const items: ReturnType<typeof getItemsData> = yield select(getItemsData)
      previewListsItemIds = previewListsItemIds.filter(itemId => !items[itemId])

      if (previewListsItemIds.length > 0) {
        const itemFilters: CatalogFilters = {
          first: previewListsItemIds.length,
          ids: previewListsItemIds
        }

        const api: CatalogAPI = yield call(getCatalogAPI)
        const result: { data: Item[] } = yield call([api, 'get'], itemFilters)
        previewItems = result.data
      }
    }

    return previewItems
  }

  function* handleFetchFavoritedItemsRequest(action: FetchFavoritedItemsRequestAction) {
    const { filters } = action.payload.options
    try {
      const address: ReturnType<typeof getAddress> = yield select(getAddress)
      // Force the user to have the signed identity
      if (address) yield call(getAccountIdentity)

      let items: Item[] = []
      const listId: string = yield select(getListId)
      const { results, total }: Awaited<ReturnType<typeof favoritesAPI.getPicksByList>> = yield call(
        [favoritesAPI, 'getPicksByList'],
        listId,
        filters
      )
      const createdAt = Object.fromEntries(results.map(favoritedItem => [favoritedItem.itemId, favoritedItem.createdAt]))
      const ids = results.map(({ itemId }) => itemId)
      const optionsFilters = {
        first: results.length,
        ids
      }
      const options: ItemBrowseOptions = {
        ...action.payload.options,
        filters: optionsFilters
      }

      const api: CatalogAPI = yield call(getCatalogAPI)

      if (results.length > 0) {
        const result: { data: Item[] } = yield call([api, 'get'], optionsFilters)
        items = result.data
      }

      yield put(fetchFavoritedItemsSuccess(items, createdAt, total, options, Date.now(), action.payload.forceLoadMore))
    } catch (error) {
      yield put(fetchFavoritedItemsFailure(isErrorWithMessage(error) ? error.message : 'Unknown error'))
    }
  }

  function* handleFetchListsRequest(action: FetchListsRequestAction) {
    const { options } = action.payload

    try {
      // Force the user to have the signed identity
      yield call(getAccountIdentity)
      let sortBy: ListsSortBy | undefined
      let sortDirection: SortDirection | undefined

      if (options.sortBy) {
        const sortValues: {
          sortBy: ListsSortBy
          sortDirection: SortDirection
        } = yield call(convertListsBrowseSortByIntoApiSortBy, options.sortBy)
        sortBy = sortValues.sortBy
        sortDirection = sortValues.sortDirection
      }

      const { results, total }: Awaited<ReturnType<typeof favoritesAPI.getLists>> = yield call([favoritesAPI, 'getLists'], {
        first: options.first,
        skip: options.skip ?? (options.page - 1) * options.first,
        sortBy,
        sortDirection
      })

      const previewListsItemIds = Array.from(new Set(results.flatMap(list => list.previewOfItemIds)))
      const previewItems: Item[] = yield call(fetchPreviewItems, previewListsItemIds)

      yield put(fetchListsSuccess(results, previewItems, total, options))
    } catch (error) {
      yield put(fetchListsFailure(isErrorWithMessage(error) ? error.message : 'Unknown error'))
    }
  }

  function* handleDeleteListStart(action: DeleteListStartAction) {
    const { list } = action.payload
    if (list.itemsCount > 0) {
      yield put(openModal('ConfirmDeleteListModal', { list: action.payload.list }))
    } else {
      yield put(deleteListRequest(list))
    }
  }

  function* handleDeleteListSuccess() {
    const { pathname } = yield select(getLocation)
    if (pathname !== locations.lists()) yield put(push(locations.lists()))
  }

  function* handleDeleteListRequest(action: DeleteListRequestAction) {
    const { list } = action.payload

    try {
      // Force the user to have the signed identity
      yield call(getAccountIdentity)
      yield call([favoritesAPI, 'deleteList'], list.id)
      yield put(deleteListSuccess(list))
    } catch (error) {
      yield put(deleteListFailure(list, isErrorWithMessage(error) ? error.message : 'Unknown error'))
    }
  }

  function* handleGetListRequest(action: GetListRequestAction) {
    const { id } = action.payload

    try {
      const list: Awaited<ReturnType<typeof favoritesAPI.getList>> = yield call([favoritesAPI, 'getList'], id)

      const { previewOfItemIds } = list

      const previewItems: Item[] = yield call(fetchPreviewItems, previewOfItemIds)

      yield put(getListSuccess(list, previewItems))
    } catch (error) {
      yield put(getListFailure(id, isErrorWithMessage(error) ? error.message : 'Unknown error'))
    }
  }

  function* handleUpdateListRequest(action: UpdateListRequestAction) {
    const { id, updatedList } = action.payload

    try {
      const list: Awaited<ReturnType<typeof favoritesAPI.updateList>> = yield call([favoritesAPI, 'updateList'], id, updatedList)
      yield put(updateListSuccess(list))
    } catch (error) {
      yield put(updateListFailure(id, isErrorWithMessage(error) ? error.message : 'Unknown error'))
    }
  }

  function* handleCreateListRequest(action: CreateListRequestAction) {
    const { name, isPrivate, description } = action.payload
    try {
      const { pathname } = yield select(getLocation)
      // Force the user to have the signed identity
      yield call(getAccountIdentity)
      const list: Awaited<ReturnType<typeof favoritesAPI.createList>> = yield call([favoritesAPI, 'createList'], {
        name,
        isPrivate,
        description
      })
      yield put(createListSuccess(list))
      if (pathname === locations.lists()) {
        yield put(push(locations.list(list.id)))
      }
    } catch (error) {
      yield put(createListFailure(isErrorWithMessage(error) ? error.message : 'Unknown error'))
    }
  }

  function* handleBulkPickStart(action: BulkPickUnpickStartAction) {
    const { item } = action.payload
    try {
      const address: string = yield select(getAddress)

      if (!address) {
        yield put(openModal('LoginModal'))

        const {
          success,
          close
        }: {
          success: ConnectWalletSuccessAction
          failure: ConnectWalletSuccessAction
          close: CloseModalAction
        } = yield race({
          success: take(CONNECT_WALLET_SUCCESS),
          failure: take(CONNECT_WALLET_FAILURE),
          close: take(CLOSE_MODAL)
        })

        if (close) {
          yield put(bulkPickUnpickCancel(item))
          return
        }

        if (success) yield put(closeModal('LoginModal'))
      }

      // Force the user to have the signed identity
      yield call(getAccountIdentity)

      yield put(openModal('SaveToListModal', { item }))

      const {
        listCreationSuccess
      }: {
        listCreationSuccess: CreateListSuccessAction
        picksInBulkRequest: BulkPickUnpickRequestAction
        modalClosed: CloseModalAction
      } = yield race({
        listCreationSuccess: take(CREATE_LIST_SUCCESS),
        picksInBulkRequest: take(BULK_PICK_REQUEST),
        modalClosed: take(CLOSE_MODAL)
      })

      if (listCreationSuccess) {
        yield put(closeModal('SaveToListModal'))

        const { list: newList } = listCreationSuccess.payload
        const list: List = yield select(getList, newList.id)

        const pickedList = {
          ...list,
          ...newList,
          previewOfItemIds: list.previewOfItemIds ?? []
        }

        yield put(bulkPickUnpickRequest(item, [pickedList], []))
      }
    } catch (error) {
      yield put(bulkPickUnpickCancel(item, isErrorWithMessage(error) ? error.message : 'Unknown error'))
    }
  }

  function* handleBulkPickRequest(action: BulkPickUnpickRequestAction) {
    const { item, pickedFor, unpickedFrom } = action.payload

    try {
      // Force the user to have the signed identity
      yield call(getAccountIdentity)
      const { pickedByUser }: Awaited<ReturnType<typeof favoritesAPI.bulkPickUnpick>> = yield call(
        [favoritesAPI, 'bulkPickUnpick'],
        item.id,
        pickedFor.map(list => list.id),
        unpickedFrom.map(list => list.id)
      )
      const isOwnerUnpickingFromListInView: ReturnType<typeof isOwnerUnpickingFromCurrentList> = yield select(
        isOwnerUnpickingFromCurrentList,
        unpickedFrom
      )

      yield put(bulkPickUnpickSuccess(item, pickedFor, unpickedFrom, pickedByUser, isOwnerUnpickingFromListInView))
    } catch (error) {
      yield put(bulkPickUnpickFailure(item, pickedFor, unpickedFrom, isErrorWithMessage(error) ? error.message : 'Unknown error'))
    }
  }

  function* handleBulkPickSuccessOrFailure(action: BulkPickUnpickSuccessAction | BulkPickUnpickFailureAction) {
    const { item, pickedFor, unpickedFrom } = action.payload

    if (action.type === BULK_PICK_SUCCESS) {
      for (const list of pickedFor) {
        yield put(pickItemSuccess(item, list.id))
      }
      for (const list of unpickedFrom) {
        yield put(unpickItemSuccess(item, list.id))
      }
    } else {
      const { error } = action.payload
      for (const list of pickedFor) {
        yield put(pickItemFailure(item, list.id, error))
      }
      for (const list of unpickedFrom) {
        yield put(unpickItemFailure(item, list.id, error))
      }
    }
  }
}
