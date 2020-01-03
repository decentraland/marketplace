import { takeLatest, put, call } from 'redux-saga/effects'
import {
  FETCH_ORDERS_REQUEST,
  FetchOrdersRequestAction,
  DEFAULT_FETCH_ORDER_OPTIONS,
  fetchOrdersSuccess,
  fetchOrdersFailure
} from './actions'
import { marketplace } from '../../lib/api/marketplace'

export function* orderSaga() {
  yield takeLatest(FETCH_ORDERS_REQUEST, handleFetchOrdersRequest)
}

function* handleFetchOrdersRequest(action: FetchOrdersRequestAction) {
  const options = {
    ...DEFAULT_FETCH_ORDER_OPTIONS,
    ...action.payload.options
  }

  try {
    const orders = yield call(() => marketplace.fetchOrders(options))
    yield put(fetchOrdersSuccess(options, orders))
  } catch (error) {
    yield put(fetchOrdersFailure(options, error.message))
  }
}
