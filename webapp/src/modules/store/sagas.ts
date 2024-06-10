import { ContentClient } from 'dcl-catalyst-client/dist/client/ContentClient'
import { call, put, takeEvery } from 'redux-saga/effects'
import { AuthIdentity } from '@dcl/crypto'
import { Entity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { getIdentity } from '../identity/utils'
import {
  fetchStoreFailure,
  FetchStoreRequestAction,
  fetchStoreSuccess,
  FETCH_STORE_REQUEST,
  updateStoreFailure,
  UpdateStoreRequestAction,
  updateStoreSuccess,
  UPDATE_STORE_REQUEST
} from './actions'
import { deployStoreEntity, fetchStoreEntity, getStoreFromEntity } from './utils'

export function* storeSaga(client: ContentClient) {
  yield takeEvery(FETCH_STORE_REQUEST, handleFetchStoreRequest)
  yield takeEvery(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)

  function* handleFetchStoreRequest({ payload: { address } }: FetchStoreRequestAction) {
    try {
      const storeEntity: Entity | null = (yield call(fetchStoreEntity, client, address)) as Awaited<ReturnType<typeof fetchStoreEntity>>

      yield put(fetchStoreSuccess(storeEntity ? getStoreFromEntity(storeEntity) : undefined))
    } catch (error) {
      yield put(fetchStoreFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }

  function* handleUpdateStoreRequest({ payload: { store } }: UpdateStoreRequestAction) {
    try {
      const identity = (yield call(getIdentity)) as AuthIdentity

      yield call(deployStoreEntity, client, identity, store)

      yield put(updateStoreSuccess(store))
    } catch (error) {
      yield put(updateStoreFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }
}
