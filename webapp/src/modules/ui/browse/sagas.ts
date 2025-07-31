import { History } from 'history'
import { getContext, put, select, takeEvery } from 'redux-saga/effects'
import { Item } from '@dcl/schemas'
import { BULK_PICK_SUCCESS, BulkPickUnpickSuccessAction, fetchFavoritedItemsRequest } from '../../favorites/actions'
import { isOwnerUnpickingFromCurrentList } from '../../favorites/selectors'
import { getListIdFromCurrentUrlPath } from '../../routing/hooks'
import { getPageNumber } from '../../routing/selectors'
import { PAGE_SIZE } from '../../vendor/api'
import { getCount, getItemsPickedByUserOrCreator } from './selectors'

export function* browseSaga() {
  yield takeEvery(BULK_PICK_SUCCESS, handleBulkPickSuccess)
}

function* handleBulkPickSuccess(action: BulkPickUnpickSuccessAction) {
  const { unpickedFrom } = action.payload
  const history: History = yield getContext('history')
  const listId: string | null = getListIdFromCurrentUrlPath(history.location.pathname)

  const currentPage: number = (yield select(getPageNumber)) as ReturnType<typeof getPageNumber>
  const isOwnerUnpickingFromListInView: ReturnType<typeof isOwnerUnpickingFromCurrentList> = (yield select(
    isOwnerUnpickingFromCurrentList,
    unpickedFrom,
    listId
  )) as ReturnType<typeof isOwnerUnpickingFromCurrentList>
  const favoritedAssets: Item[] = (yield select(getItemsPickedByUserOrCreator, listId)) as ReturnType<typeof getItemsPickedByUserOrCreator>
  const totalFavoritedAssets: number = ((yield select(getCount)) as ReturnType<typeof getCount>) ?? 0

  if (favoritedAssets.length < totalFavoritedAssets && isOwnerUnpickingFromListInView) {
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
