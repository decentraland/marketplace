import { LocationChangeAction, LOCATION_CHANGE } from 'connected-react-router'
import { ContentClient } from 'dcl-catalyst-client/dist/client/ContentClient'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { AuthIdentity } from '@dcl/crypto'
import { Entity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
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
import { getIsLocalStoreDirty } from './selectors'
import { deployStoreEntity, fetchStoreEntity, getStoreFromEntity } from './utils'

export function* storeSaga(client: ContentClient) {
  yield takeEvery(FETCH_STORE_REQUEST, handleFetchStoreRequest)
  yield takeEvery(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)
  yield takeEvery(LOCATION_CHANGE, handleLocationChange)

  function* handleLocationChange({ payload: { location } }: LocationChangeAction) {
    const isLocalStoreDirty = (yield select(getIsLocalStoreDirty)) as ReturnType<typeof getIsLocalStoreDirty>
    if (!isLocalStoreDirty) {
      return
    }

    const address = (yield select(getAddress)) as ReturnType<typeof getAddress>
    const allowed = ['section=store_settings&', 'viewAsGuest=true']
    if (!allowed.some(value => location.search.includes(value)) && address) {
      yield put(revertLocalStore(address))
    }
  }

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
