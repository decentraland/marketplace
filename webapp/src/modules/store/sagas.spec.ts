import { createFetchComponent } from '@well-known-components/fetch-component'
import { createContentClient, ContentClient } from 'dcl-catalyst-client/dist/client/ContentClient'
import { call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { AuthIdentity } from '@dcl/crypto'
import { Entity } from '@dcl/schemas'
import { getIdentity } from '../identity/utils'
import { getAddress } from '../wallet/selectors'
import { fetchStoreFailure, fetchStoreRequest, fetchStoreSuccess, updateStoreRequest, updateStoreSuccess } from './actions'
import { storeSaga } from './sagas'
import { Store, StoreEntityMetadata } from './types'
import { deployStoreEntity, fetchStoreEntity, getEmptyStore, getPeerCoverUrl } from './utils'

jest.mock('../../lib/environment', () => ({
  peerUrl: 'http://peer.com'
}))

let mockAddress: string
let mockClient: ContentClient
let mockStore: Store

beforeEach(() => {
  mockAddress = 'address'
  mockClient = createContentClient({ url: 'some-url', fetcher: createFetchComponent() })
  mockStore = getEmptyStore({ owner: mockAddress })
})

describe('when handling the fetch of a user store', () => {
  describe('when fetch store entity fails to return', () => {
    it('should put a fetch store failure action with a failed to fetch', () => {
      const error = new Error('Failed to fetch')

      return expectSaga(storeSaga, mockClient)
        .provide([[call(fetchStoreEntity, mockClient, mockAddress), Promise.reject(error)]])
        .dispatch(fetchStoreRequest(mockAddress))
        .put(fetchStoreFailure(error.message))
        .silentRun()
    })
  })

  describe('when fetch store entity returns null', () => {
    it('should put a fetch store success action with an undefined store', () => {
      return expectSaga(storeSaga, mockClient)
        .provide([[call(fetchStoreEntity, mockClient, mockAddress), null]])
        .dispatch(fetchStoreRequest(mockAddress))
        .put(fetchStoreSuccess(undefined))
        .silentRun()
    })
  })

  describe('when fetch store entity returns an entity', () => {
    it('should put a fetch store success action with a store', () => {
      return expectSaga(storeSaga, mockClient)
        .provide([
          [
            call(fetchStoreEntity, mockClient, mockAddress),
            {
              id: 'id',
              pointers: ['owner'],
              timestamp: 100,
              type: 'store' as any,
              content: [{ file: 'coverName', hash: 'hash' }],
              metadata: {
                description: 'description',
                id: 'id',
                images: [{ name: 'cover', file: 'coverName' }],
                links: [
                  { name: 'website', url: 'website' },
                  { name: 'facebook', url: 'facebook' },
                  { name: 'twitter', url: 'twitter' },
                  { name: 'discord', url: 'discord' }
                ],
                owner: 'owner',
                version: 1
              } as StoreEntityMetadata
            } as Entity
          ]
        ])
        .dispatch(fetchStoreRequest(mockAddress))
        .put(
          fetchStoreSuccess({
            cover: getPeerCoverUrl('hash'),
            coverName: 'coverName',
            description: 'description',
            owner: 'owner',
            discord: 'discord',
            facebook: 'facebook',
            twitter: 'twitter',
            website: 'website'
          })
        )
        .silentRun()
    })
  })
})

describe('when handling the update of a store', () => {
  it('should put an update store success action with the provided store', () => {
    const identity = {} as AuthIdentity
    return expectSaga(storeSaga, mockClient)
      .provide([
        [call(getIdentity), identity],
        [select(getAddress), mockAddress],
        [call(deployStoreEntity, mockClient, identity, mockStore), {}]
      ])
      .dispatch(updateStoreRequest(mockStore))
      .put(updateStoreSuccess(mockStore))
      .silentRun()
  })
})
