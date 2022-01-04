import { call, put, select, takeLatest } from 'redux-saga/effects'
import { AuthIdentity } from 'dcl-crypto'
import { CatalystClient } from 'dcl-catalyst-client'
import { Entity } from 'dcl-catalyst-commons'
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
import { getAddress } from '../wallet/selectors'
import {
  deployStoreEntity,
  fetchStoreEntity,
  getStoreFromEntity
} from './utils'

export function* storeSaga(client: CatalystClient) {
  yield takeLatest(FETCH_STORE_REQUEST, handleFetchStoreRequest)
  yield takeLatest(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)

  function* handleFetchStoreRequest({
    payload: { address }
  }: FetchStoreRequestAction) {
    try {
      const storeEntity: Entity | null = yield call(
        fetchStoreEntity,
        client,
        address
      )

      if (!storeEntity) {
        yield put(fetchStoreFailure('Store not found'))
      } else {
        yield put(fetchStoreSuccess(getStoreFromEntity(storeEntity)))
      }
    } catch (e) {
      yield put(fetchStoreFailure(e.message))
    }
  }

  function* handleUpdateStoreRequest({
    payload: { store }
  }: UpdateStoreRequestAction) {
    try {
      const identity: AuthIdentity = yield call(getIdentity)
      const address: string = (yield select(getAddress))!

      yield call(deployStoreEntity, client, identity, address, store)

      yield put(updateStoreSuccess(store))
    } catch (e) {
      yield put(updateStoreFailure(e.message))
    }
  }
}
