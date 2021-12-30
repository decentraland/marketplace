import { call, put, select, takeLatest } from 'redux-saga/effects'
import { AuthIdentity, Authenticator } from 'dcl-crypto'
import { Store as CatalystStore } from '@dcl/schemas'
import {
  BuildEntityOptions,
  BuildEntityWithoutFilesOptions,
  CatalystClient,
  DeploymentPreparationData
} from 'dcl-catalyst-client'
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
import { getData as getStoresByOwner } from './selectors'
import { toCatalystStore, toStore } from './utils'

export function* storeSaga(client: CatalystClient) {
  yield takeLatest(FETCH_STORE_REQUEST, handleFetchStoreRequest)
  yield takeLatest(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)

  function* handleFetchStoreRequest({
    payload: { address }
  }: FetchStoreRequestAction) {
    try {
      const result = ((yield client.fetchEntitiesByPointers('store' as any, [
        address
      ])) as unknown) as any[]

      if (result.length === 0) {
        yield put(fetchStoreFailure('Store not found'))
      } else {
        yield put(fetchStoreSuccess(toStore(result[0])))
      }
    } catch (e) {
      yield put(fetchStoreFailure(e.message))
    }
  }

  function* handleUpdateStoreRequest(action: UpdateStoreRequestAction) {
    try {
      const { store } = action.payload

      const identity: AuthIdentity = yield call(getIdentity)
      const address: string = (yield select(getAddress))!

      const storesByOwner: ReturnType<typeof getStoresByOwner> = yield select(
        getStoresByOwner
      )

      const hasDifferentCover = storesByOwner[address]?.cover !== store.cover

      const metadata: CatalystStore = toCatalystStore(
        store,
        address,
        hasDifferentCover
      )

      let entity: DeploymentPreparationData

      const baseOptions: BuildEntityWithoutFilesOptions = {
        type: 'store' as any,
        pointers: [address],
        metadata,
        timestamp: Date.now()
      }

      if (hasDifferentCover) {
        const files = new Map<string, Buffer>()

        if (store.cover && store.coverName) {
          const response: Response = yield fetch(store.cover)
          const arrayBuffer: Blob = yield response.arrayBuffer()
          files.set(`cover/${store.coverName}`, Buffer.from(arrayBuffer))
        }

        const optionsWithFiles: BuildEntityOptions = { ...baseOptions, files }

        entity = yield client.buildEntity(optionsWithFiles)
      } else {
        const files = new Map<string, Buffer>()
        const response: Response = yield fetch(store.cover)
        const arrayBuffer: Blob = yield response.arrayBuffer()
        files.set(store.coverName, Buffer.from(arrayBuffer))
        entity = yield client.buildEntity({ ...baseOptions, files })
      }

      const authChain = Authenticator.signPayload(identity, entity.entityId)

      yield client.deployEntity({ ...entity, authChain })

      yield put(updateStoreSuccess(store))
    } catch (e) {
      yield put(updateStoreFailure(e.message))
    }
  }
}
