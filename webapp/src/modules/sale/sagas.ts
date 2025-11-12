import { call, takeEvery, put } from '@redux-saga/core/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { marketplaceSaleAPI } from '../vendor/decentraland'
import { fetchSalesFailure, FetchSalesRequestAction, fetchSalesSuccess, FETCH_SALES_REQUEST } from './actions'

export function* saleSaga() {
  yield takeEvery(FETCH_SALES_REQUEST, handleFetchSalesRequest)
}

export function* handleFetchSalesRequest(action: FetchSalesRequestAction) {
  const { filters } = action.payload

  try {
    const { data: sales, total } = (yield call([marketplaceSaleAPI, marketplaceSaleAPI.fetch], filters)) as Awaited<
      ReturnType<typeof marketplaceSaleAPI.fetch>
    >

    yield put(fetchSalesSuccess(sales, total))
  } catch (error) {
    yield put(fetchSalesFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}
