import { AuthIdentity } from '@dcl/crypto'
import { call, put, takeEvery } from 'redux-saga/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { activityAPI } from '../vendor/decentraland/activity'
import { getIdentity } from '../identity/utils'
import {
  FETCH_USER_ACTIVITY_REQUEST,
  fetchUserActivityFailure,
  fetchUserActivitySuccess
} from './actions'

export function* activitySaga() {
  yield takeEvery(FETCH_USER_ACTIVITY_REQUEST, handleFetchUserActivityRequest)
}

export function* handleFetchUserActivityRequest() {
  try {
    const identity = (yield call(getIdentity)) as AuthIdentity
    const { data, total } = (yield call([activityAPI, activityAPI.fetchUserActivity], identity)) as Awaited<
      ReturnType<typeof activityAPI.fetchUserActivity>
    >
    yield put(fetchUserActivitySuccess(data, total))
  } catch (error) {
    yield put(fetchUserActivityFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}
