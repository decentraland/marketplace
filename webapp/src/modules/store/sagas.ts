import { call, put, select, takeLatest } from 'redux-saga/effects'
import { AuthIdentity, Authenticator } from 'dcl-crypto'
import { CatalystClient, DeploymentPreparationData } from 'dcl-catalyst-client'
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

export function* storeSaga() {
  yield takeLatest(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)
}

function* handleUpdateStoreRequest(action: UpdateStoreRequestAction) {
  try {
    const { store } = action.payload

    const identity: AuthIdentity = yield call(getIdentity)

    const address: string = (yield select(getAddress))!

    const client: CatalystClient = new CatalystClient(
      process.env.REACT_APP_PEER_URL!,
      'Market'
    )

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

    const metadata: CatalystStore = toCatalystStore(store, address)

    const entity: DeploymentPreparationData = yield client.buildEntity({
      type: 'store' as any,
      pointers: [metadata.id],
      files: new Map(),
      metadata,
      timestamp: Date.now()
    })

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

  return {
    id: `urn:decentraland:marketplace:store:${address}`,
    description: store.description,
    images: [],
    links,
    owner: address,
    version: 1
  }
}
