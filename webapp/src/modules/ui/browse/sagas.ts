import { Item } from '@dcl/schemas'
import { put, select, takeEvery } from 'redux-saga/effects'
import { Section } from '../../vendor/decentraland/routing'
import {
  BULK_PICK_SUCCESS,
  BulkPickSuccessAction,
  UNPICK_ITEM_AS_FAVORITE_SUCCESS,
  fetchFavoritedItemsRequest
} from '../../favorites/actions'
import { PAGE_SIZE } from '../../vendor/api'
import { getPageNumber, getSection } from '../../routing/selectors'
import { getCount, getItemsPickedByUser } from './selectors'
import { getListId } from '../../favorites/selectors'

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
  const favoritedAssets: Item[] = yield select(getItemsPickedByUser)
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

function* handleBulkPickSuccess(action: BulkPickSuccessAction) {
  const { unpickFrom } = action.payload

  const section: Section = yield select(getSection)
  const currentPage: number = yield select(getPageNumber)
  const currentListId: string = yield select(getListId)
  const favoritedAssets: Item[] = yield select(getItemsPickedByUser)
  const totalFavoritedAssets: number = yield select(getCount)
  if (
    section === Section.LISTS &&
    favoritedAssets.length < totalFavoritedAssets &&
    unpickFrom.find(list => list.id === currentListId)
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
