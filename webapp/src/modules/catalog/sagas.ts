import { put, takeEvery } from '@redux-saga/core/effects'
import { call } from 'redux-saga/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { catalogAPI } from '../vendor/decentraland/catalog/api'
import {
  FETCH_CATALOG_REQUEST,
  FetchCatalogRequestAction,
  fetchCatalogFailure,
  fetchCatalogSuccess
} from './actions'
import { CatalogItem } from '@dcl/schemas'

export function* catalogSaga() {
  yield takeEvery(FETCH_CATALOG_REQUEST, handleFetchCatalogRequest)
}

function* handleFetchCatalogRequest(action: FetchCatalogRequestAction) {
  const { filters } = action.payload
  try {
    const { data, total }: { data: CatalogItem[]; total: number } = yield call(
      [catalogAPI, 'fetch'],
      filters
    )
    yield put(fetchCatalogSuccess(data, total, action.payload))
  } catch (error) {
    yield put(
      fetchCatalogFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error'),
        action.payload
      )
    )
  }
}
