import { call, put, select, takeEvery } from 'redux-saga/effects'
import { LocationChangeAction, LOCATION_CHANGE } from 'connected-react-router'
import { Entity } from '@dcl/schemas'
import { AuthIdentity } from '@dcl/crypto'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { CatalystClient } from 'dcl-catalyst-client'
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
  UPDATE_STORE_REQUEST,
  revertLocalStore
} from './actions'
import {
  deployStoreEntity,
  fetchStoreEntity,
  getStoreFromEntity
} from './utils'
import { getIsLocalStoreDirty } from './selectors'

export function* storeSaga(client: CatalystClient) {
  yield takeEvery(FETCH_STORE_REQUEST, handleFetchStoreRequest)
  yield takeEvery(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)
  yield takeEvery(LOCATION_CHANGE, handleLocationChange)

  function* handleLocationChange({
    payload: { location }
  }: LocationChangeAction) {
    const isLocalStoreDirty: boolean = yield select(getIsLocalStoreDirty)
    if (!isLocalStoreDirty) {
      return
    }

    const address: string = yield select(getAddress)
    const allowed = ['section=store_settings&', 'viewAsGuest=true']
    if (!allowed.some(value => location.search.includes(value))) {
      yield put(revertLocalStore(address))
    }
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
    } catch (error) {
      yield put(
        fetchStoreFailure(
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      )
    }
  }

  function* handleUpdateStoreRequest({
    payload: { store }
  }: UpdateStoreRequestAction) {
    try {
      const identity: AuthIdentity = yield call(getIdentity)

      yield call(deployStoreEntity, client, identity, store)

      yield put(updateStoreSuccess(store))
    } catch (error) {
      yield put(
        updateStoreFailure(
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      )
    }
  }
}
