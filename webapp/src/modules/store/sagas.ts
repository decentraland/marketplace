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
  fetchStoreFailure,
  FetchStoreRequestAction,
  fetchStoreSuccess,
  FETCH_STORE_REQUEST,
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
  yield takeLatest(FETCH_STORE_REQUEST, handleFetchStoreRequest)
  yield takeLatest(UPDATE_STORE_REQUEST, handleUpdateStoreRequest)
}

function* handleFetchStoreRequest(action: FetchStoreRequestAction) {
  try {
    const address = action.payload.address
    const peerUrl = process.env.REACT_APP_PEER_URL!
    const client: CatalystClient = new CatalystClient(peerUrl, 'Market')
    const result = ((yield client.fetchEntitiesByPointers('store' as any, [
      address
    ])) as unknown) as any[]

    if (result.length === 0) {
      yield put(fetchStoreSuccess())
      return
    }

    const catalystStoreEntity = result[0]
    const catalystStoreMetadata: CatalystStore = catalystStoreEntity.metadata

    let cover: string = ''

    const metadataCoverImage = catalystStoreMetadata.images.find(
      image => image.name === 'cover'
    )

    if (metadataCoverImage) {
      const contentCoverImageHash = catalystStoreEntity.content.find(
        (cont: any) => cont.file === metadataCoverImage.file
      )

      if (contentCoverImageHash) {
        cover = `${peerUrl}/content/contents/${contentCoverImageHash.hash}`
      }
    }

    const store: Store = {
      cover,
      coverName: '',
      description: catalystStoreMetadata.description,
      website:
        catalystStoreMetadata.links.find(link => link.name === 'website')
          ?.url || '',
      facebook:
        catalystStoreMetadata.links.find(link => link.name === 'facebook')
          ?.url || '',
      twitter:
        catalystStoreMetadata.links.find(link => link.name === 'twitter')
          ?.url || '',
      discord:
        catalystStoreMetadata.links.find(link => link.name === 'discord')
          ?.url || '',
      owner: catalystStoreMetadata.owner
    }

    yield put(fetchStoreSuccess(store))
  } catch (e) {
    yield put(fetchStoreFailure(e.message))
  }
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
