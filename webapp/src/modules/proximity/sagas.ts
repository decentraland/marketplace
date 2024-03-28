import { takeEvery, call, put } from 'redux-saga/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { FETCH_TILES_SUCCESS, FetchTilesSuccessAction } from '../tile/actions'
import {
  FETCH_PROXIMITY_REQUEST,
  FetchProximityRequestAction,
  fetchProximitySuccess,
  fetchProximityFailure,
  fetchProximityRequest
} from './actions'
import { Proximity } from './types'

export function* proximitySaga() {
  yield takeEvery(FETCH_TILES_SUCCESS, handleFetchTilesSuccess)
  yield takeEvery(FETCH_PROXIMITY_REQUEST, handleFetchProximityRequest)
}

function* handleFetchProximityRequest(_action: FetchProximityRequestAction) {
  try {
    const proximity: Record<string, Proximity> = (yield call(async () => {
      const resp = await fetch(process.env.VITE_BASE_URL + '/proximity.json')
      return resp.json()
    })) as Record<string, Proximity>
    yield put(fetchProximitySuccess(proximity))
  } catch (error) {
    yield put(fetchProximityFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

function* handleFetchTilesSuccess(_action: FetchTilesSuccessAction) {
  yield put(fetchProximityRequest())
}
