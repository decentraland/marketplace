import { takeEvery, call, put } from 'redux-saga/effects'
import {
  FETCH_PROXIMITY_REQUEST,
  FetchProximityRequestAction,
  fetchProximitySuccess,
  fetchProximityFailure,
  fetchProximityRequest
} from './actions'
import { FETCH_TILES_SUCCESS, FetchTilesSuccessAction } from '../tile/actions'
import { Proximity } from './types'

export function* proximitySaga() {
  yield takeEvery(FETCH_TILES_SUCCESS, handleFetchTilesSuccess)
  yield takeEvery(FETCH_PROXIMITY_REQUEST, handleFetchProximityRequest)
}

function* handleFetchProximityRequest(_action: FetchProximityRequestAction) {
  try {
    const proximity: Record<string, Proximity> = yield call(async () => {
      const resp = await fetch('/proximity.json')
      return resp.json()
    })
    yield put(fetchProximitySuccess(proximity))
  } catch (error) {
    yield put(fetchProximityFailure(error.message))
  }
}

function* handleFetchTilesSuccess(_action: FetchTilesSuccessAction) {
  yield put(fetchProximityRequest())
}
