import { Item } from '@dcl/schemas'
import { put, select, takeEvery } from 'redux-saga/effects'
import { Section } from '../../vendor/decentraland/routing'
import {
  BULK_PICK_SUCCESS,
  BulkPickUnpickSuccessAction,
  UNPICK_ITEM_AS_FAVORITE_SUCCESS,
  fetchFavoritedItemsRequest
} from '../../favorites/actions'
import { PAGE_SIZE } from '../../vendor/api'
import { getPageNumber, getSection } from '../../routing/selectors'
import { isOwnerUnpickingFromCurrentList } from '../../favorites/selectors'
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
  const isOwnerUnpickingFromListInView: ReturnType<typeof isOwnerUnpickingFromCurrentList> = yield select(
    isOwnerUnpickingFromCurrentList,
    unpickedFrom
  )
  const favoritedAssets: Item[] = yield select(getItemsPickedByUserOrCreator)
  const totalFavoritedAssets: number = yield select(getCount)

  if (
    favoritedAssets.length < totalFavoritedAssets &&
    isOwnerUnpickingFromListInView
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
