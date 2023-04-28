import { Item } from '@dcl/schemas'
import { put, select, takeEvery } from 'redux-saga/effects'
import { Section } from '../../vendor/decentraland/routing'
import {
  UNPICK_ITEM_AS_FAVORITE_SUCCESS,
  fetchFavoritedItemsRequest
} from '../../favorites/actions'
import { PAGE_SIZE } from '../../vendor/api'
import { getPageNumber, getSection } from '../../routing/selectors'
import { View } from '../types'
import { getCount, getItemsPickedByUser } from './selectors'

export function* browseSaga() {
  yield takeEvery(
    UNPICK_ITEM_AS_FAVORITE_SUCCESS,
    handleUnpickItemAsFavoriteSuccess
  )
}

function* handleUnpickItemAsFavoriteSuccess() {
  const section: Section = yield select(getSection)
  const page: number = yield select(getPageNumber)
  const favoritedAssets: Item[] = yield select(getItemsPickedByUser)
  const totalFavoritedAssets: number = yield select(getCount)
  if (
    section === Section.LISTS &&
    favoritedAssets.length < totalFavoritedAssets
  ) {
    yield put(
      fetchFavoritedItemsRequest({
        filters: { first: 1, skip: page * PAGE_SIZE - 1 },
        view: View.LOAD_MORE,
        section: Section.LISTS
      })
    )
  }
}
