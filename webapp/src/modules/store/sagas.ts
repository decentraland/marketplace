import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { LocationChangeAction, LOCATION_CHANGE } from 'connected-react-router'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
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
  UPDATE_STORE_REQUEST,
  revertLocalStore
} from './actions'
import {
  deployStoreEntity,
  fetchStoreEntity,
  getStoreFromEntity
} from './utils'

export function* storeSaga(client: CatalystClient) {
  yield takeLatest(FETCH_STORE_REQUEST, handleFetchStoreRequest)
  yield takeLatest(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)
  yield takeEvery(LOCATION_CHANGE, handleLocationChange)

  function* handleLocationChange({
    payload: { location }
  }: LocationChangeAction) {
    const address: string = yield select(getAddress)
    if (
      !location.search.includes('section=store_settings&') &&
      !location.search.includes('viewAsGuest=true')
    )
      yield put(revertLocalStore(address))
  }

  function* handleFetchStoreRequest({
    payload: { address }
  }: FetchStoreRequestAction) {
    try {
      const storeEntity: Entity | null = yield call(
        fetchStoreEntity,
        client,
        address
      )

      yield put(
        fetchStoreSuccess(
          storeEntity ? getStoreFromEntity(storeEntity) : undefined
        )
      )
    } catch (e) {
      yield put(fetchStoreFailure(e.message))
    }
  }

  function* handleUpdateStoreRequest({
    payload: { store }
  }: UpdateStoreRequestAction) {
    try {
      const identity: AuthIdentity = yield call(getIdentity)

      yield call(deployStoreEntity, client, identity, store)

      yield put(updateStoreSuccess(store))
    } catch (e) {
      yield put(updateStoreFailure(e.message))
    }
  }
}
