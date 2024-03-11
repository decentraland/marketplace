import { call, takeEvery, put } from '@redux-saga/core/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { builderAPI } from '../vendor/decentraland/builder/api'
import { fetchEventFailure, FetchEventRequestAction, fetchEventSuccess, FETCH_EVENT_REQUEST } from './actions'

export function* eventSaga() {
  yield takeEvery(FETCH_EVENT_REQUEST, handleFetchEventRequest)
}

export function* handleFetchEventRequest(action: FetchEventRequestAction) {
  const { eventTag, additionalSearchTags } = action.payload

  try {
    const addresses: string[] = yield call([builderAPI, builderAPI.fetchAddressesByTag], [eventTag, ...additionalSearchTags])

    yield put(fetchEventSuccess(eventTag, addresses))
  } catch (error) {
    yield put(fetchEventFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}
