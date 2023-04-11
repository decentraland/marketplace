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
import { CatalogItem } from './types'

export function* catalogSaga() {
  yield takeEvery(FETCH_CATALOG_REQUEST, handleFetchCatalogRequest)
}

function* handleFetchCatalogRequest(action: FetchCatalogRequestAction) {
  console.log('action: ', action)
  const { filters } = action.payload
  console.log('filters: ', filters)
  try {
    const { data, total }: { data: CatalogItem[]; total: number } = yield call(
      [catalogAPI, 'fetch'],
      filters
    )
    yield put(fetchCatalogSuccess(data, total, filters))
  } catch (error) {
    console.log('error: ', error)
    yield put(
      fetchCatalogFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error'),
        filters
      )
    )
  }
}
