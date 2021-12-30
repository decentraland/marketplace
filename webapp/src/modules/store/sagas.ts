import { call, put, select, takeLatest } from 'redux-saga/effects'
import { AuthIdentity, Authenticator } from 'dcl-crypto'
import {
  BuildEntityWithoutFilesOptions,
  CatalystClient,
  DeploymentPreparationData
} from 'dcl-catalyst-client'
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
import { getData as getStoresByOwner } from './selectors'
import { toCatalystStore, toStore } from './utils'

export function* storeSaga(client: CatalystClient) {
  yield takeLatest(FETCH_STORE_REQUEST, handleFetchStoreRequest)
  yield takeLatest(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)

  function* handleFetchStoreRequest({
    payload: { address }
  }: FetchStoreRequestAction) {
    try {
      const storeEntity: Entity | null = yield fetchStoreEntity()

      if (!storeEntity) {
        yield put(fetchStoreFailure('Store not found'))
      } else {
        yield put(fetchStoreSuccess(toStore(storeEntity)))
      }
    } catch (e) {
      yield put(fetchStoreFailure(e.message))
    }

    async function fetchStoreEntity(): Promise<Entity | null> {
      const type: any = 'store'
      const entities = await client.fetchEntitiesByPointers(type, [address])
      return entities.length === 0 ? null : entities[0]
    }
  }

  function* handleUpdateStoreRequest({
    payload: { store }
  }: UpdateStoreRequestAction) {
    try {
      const identity: AuthIdentity = yield call(getIdentity)
      const address: string = (yield select(getAddress))!
      const storesByOwner: ReturnType<typeof getStoresByOwner> = yield select(
        getStoresByOwner
      )
      const hasDifferentCover = storesByOwner[address]?.cover !== store.cover
      const metadata = toCatalystStore(store, address, hasDifferentCover)

      const options: BuildEntityWithoutFilesOptions = {
        type: 'store' as any,
        pointers: [address],
        metadata,
        timestamp: Date.now()
      }

      const files: Map<string, Buffer> = yield getFiles(hasDifferentCover)

      const entity: DeploymentPreparationData =
        files.size === 0
          ? yield client.buildEntityWithoutNewFiles(options)
          : yield client.buildEntity({ ...options, files })

      const authChain = Authenticator.signPayload(identity, entity.entityId)

      yield client.deployEntity({ ...entity, authChain })

      yield put(updateStoreSuccess(store))
    } catch (e) {
      yield put(updateStoreFailure(e.message))
    }

    async function getFiles(hasDifferentCover: boolean) {
      const files = new Map<string, Buffer>()

      if (store.cover) {
        const response: Response = await fetch(store.cover)
        const arrayBuffer: ArrayBuffer = await response.arrayBuffer()
        const key = (hasDifferentCover ? 'cover/' : '') + store.coverName

        files.set(key, Buffer.from(arrayBuffer))
      }

      return files
    }
  }
}
