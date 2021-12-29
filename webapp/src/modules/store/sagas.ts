import { call, put, select, takeLatest } from 'redux-saga/effects'
import { AuthIdentity, Authenticator } from 'dcl-crypto'
import {
  BuildEntityOptions,
  BuildEntityWithoutFilesOptions,
  CatalystClient,
  DeploymentPreparationData
} from 'dcl-catalyst-client'
import { getIdentity } from '../identity/utils'
import {
  updateStoreFailure,
  UpdateStoreRequestAction,
  updateStoreSuccess,
  UPDATE_STORE_REQUEST
} from './actions'
import { Store as CatalystStore } from '@dcl/schemas'
import { getAddress } from '../wallet/selectors'
import { Store } from './types'
import { getData as getStoresByOwner } from './selectors'

export function* storeSaga() {
  yield takeLatest(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)
}

function* handleUpdateStoreRequest(action: UpdateStoreRequestAction) {
  try {
    const { store } = action.payload

    const identity: AuthIdentity = yield call(getIdentity)
    const address: string = (yield select(getAddress))!
    const peerUrl = process.env.REACT_APP_PEER_URL!
    const client: CatalystClient = new CatalystClient(peerUrl, 'Market')
    const metadata: CatalystStore = toCatalystStore(store, address)

    const storesByOwner: ReturnType<typeof getStoresByOwner> = yield select(
      getStoresByOwner
    )

    const hasDifferentCover = storesByOwner[address]?.cover !== store.cover

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
      entity = yield client.buildEntityWithoutNewFiles(baseOptions)
    }

    const authChain = Authenticator.signPayload(identity, entity.entityId)

    yield client.deployEntity({ ...entity, authChain })

    yield put(updateStoreSuccess(store))
  } catch (e) {
    yield put(updateStoreFailure(e.message))
  }
}

const toCatalystStore = (store: Store, address: string): CatalystStore => {
  const links: CatalystStore['links'] = []

  if (store.website) {
    links.push({ name: 'website', url: store.website })
  }

  if (store.facebook) {
    links.push({ name: 'facebook', url: store.facebook })
  }

  if (store.twitter) {
    links.push({ name: 'twitter', url: store.twitter })
  }

  if (store.discord) {
    links.push({ name: 'discord', url: store.discord })
  }

  let images: CatalystStore['images'] = []

  if (store.cover && store.coverName) {
    images.push({ name: 'cover', file: `cover/${store.coverName}` })
  }

  return {
    id: `urn:decentraland:marketplace:store:${address}`,
    description: store.description,
    images,
    links,
    owner: address,
    version: 1
  }
}
