import { call, put, takeEvery } from 'redux-saga/effects'
import { AuthIdentity } from '@dcl/crypto'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { getIdentity } from '../identity/utils'
import { activityAPI } from '../vendor/decentraland/activity'
import { FETCH_USER_ACTIVITY_REQUEST, FetchUserActivityRequestAction, fetchUserActivityFailure, fetchUserActivitySuccess } from './actions'

export function* activitySaga() {
  yield takeEvery(FETCH_USER_ACTIVITY_REQUEST, handleFetchUserActivityRequest)
}

export function* handleFetchUserActivityRequest(action: FetchUserActivityRequestAction) {
  const { limit, offset } = action.payload
  try {
    const identity = (yield call(getIdentity)) as AuthIdentity
    const { data, total } = (yield call([activityAPI, activityAPI.fetchUserActivity], identity, { limit, offset })) as Awaited<
      ReturnType<typeof activityAPI.fetchUserActivity>
    >
    yield put(fetchUserActivitySuccess(data, total, offset))
  } catch (error) {
    yield put(fetchUserActivityFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}
