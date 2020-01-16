import { put, call, takeEvery } from 'redux-saga/effects'
import {
  FETCH_ORDERS_REQUEST,
  FetchOrdersRequestAction,
  DEFAULT_FETCH_ORDER_OPTIONS,
  fetchOrdersSuccess,
  fetchOrdersFailure
} from './actions'
import { marketplace as marketplaceAPI } from '../../lib/api/marketplace'

export function* orderSaga() {
  yield takeEvery(FETCH_ORDERS_REQUEST, handleFetchOrdersRequest)
}

function* handleFetchOrdersRequest(action: FetchOrdersRequestAction) {
  const options = {
    ...DEFAULT_FETCH_ORDER_OPTIONS,
    ...action.payload.options
  }

  try {
    const [orders, nfts] = yield call(() => marketplaceAPI.fetchOrders(options))
    yield put(fetchOrdersSuccess(options, orders, nfts))
  } catch (error) {
    yield put(fetchOrdersFailure(options, error.message))
  }
}
