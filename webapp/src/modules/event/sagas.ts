import { call, takeEvery, put } from '@redux-saga/core/effects'
import { builderAPI } from '../vendor/decentraland/builder/api'
import {
  fetchEventFailure,
  FetchEventRequestAction,
  fetchEventSuccess,
  FETCH_EVENT_REQUEST
} from './actions'

export function* eventSaga() {
  yield takeEvery(FETCH_EVENT_REQUEST, handleFetchEventRequest)
}

export function* handleFetchEventRequest(action: FetchEventRequestAction) {
  const { tag } = action.payload

  try {
    const addresses: string[] = yield call(
      [builderAPI, builderAPI.fetchAddressesByTag],
      [tag]
    )

    yield put(fetchEventSuccess(tag, addresses))
  } catch (error) {
    yield put(fetchEventFailure(error.message))
  }
}
