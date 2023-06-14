import { Item } from '@dcl/schemas'
import { put, select, takeEvery } from 'redux-saga/effects'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Section } from '../../vendor/decentraland/routing'
import {
  BULK_PICK_SUCCESS,
  BulkPickUnpickSuccessAction,
  UNPICK_ITEM_AS_FAVORITE_SUCCESS,
  fetchFavoritedItemsRequest
} from '../../favorites/actions'
import { PAGE_SIZE } from '../../vendor/api'
import { getPageNumber, getSection } from '../../routing/selectors'
import { getListId, getList } from '../../favorites/selectors'
import { List } from '../../favorites/types'
import { getCount, getItemsPickedByUserOrCreator } from './selectors'

export function* browseSaga() {
  yield takeEvery(
    UNPICK_ITEM_AS_FAVORITE_SUCCESS,
    handleUnpickItemAsFavoriteSuccess
  )
  yield takeEvery(BULK_PICK_SUCCESS, handleBulkPickSuccess)
}

function* handleUnpickItemAsFavoriteSuccess() {
  const section: Section = yield select(getSection)
  const currentPage: number = yield select(getPageNumber)
  const favoritedAssets: Item[] = yield select(getItemsPickedByUserOrCreator)
  const totalFavoritedAssets: number = yield select(getCount)
  if (
    section === Section.LISTS &&
    favoritedAssets.length < totalFavoritedAssets
  ) {
    yield put(
      fetchFavoritedItemsRequest(
        {
          filters: { first: 1, skip: currentPage * PAGE_SIZE - 1 }
        },
        true
      )
    )
  }
}

function* handleBulkPickSuccess(action: BulkPickUnpickSuccessAction) {
  const { unpickedFrom } = action.payload

  const currentPage: number = yield select(getPageNumber)
  const currentListId: string | null = yield select(getListId)
  const currentList: List | null = currentListId
    ? yield select(getList, currentListId)
    : null
  const currentAddress: string | null = yield select(getAddress)
  const favoritedAssets: Item[] = yield select(getItemsPickedByUserOrCreator)
  const totalFavoritedAssets: number = yield select(getCount)
  if (
    favoritedAssets.length < totalFavoritedAssets &&
    unpickedFrom.find(list => list.id === currentListId) &&
    currentList?.userAddress?.toLowerCase() === currentAddress?.toLowerCase()
  ) {
    yield put(
      fetchFavoritedItemsRequest(
        {
          filters: { first: 1, skip: currentPage * PAGE_SIZE - 1 }
        },
        true
      )
    )
  }
}
