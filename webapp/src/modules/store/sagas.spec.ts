import { CatalystClient } from 'dcl-catalyst-client'
import { Entity } from 'dcl-catalyst-commons'
import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import {
  fetchStoreFailure,
  fetchStoreRequest,
  fetchStoreSuccess
} from './actions'
import { storeSaga } from './sagas'
import { StoreEntityMetadata } from './types'
import { fetchStoreEntity, getPeerCoverUrl } from './utils'

jest.mock('../../lib/environment', () => ({
  peerUrl: 'http://peer.com'
}))

describe('when handling the fetch of a user store', () => {
  const address = 'address'

  let client: CatalystClient

  beforeEach(() => {
    client = new CatalystClient('some-url', 'some-origin')
  })

  describe('when fetch store entity fails to return', () => {
    it('should put a fetch store failure action with a not found error', () => {
      const error = new Error('Failed to fetch')

      return expectSaga(storeSaga, client)
        .provide([
          [call(fetchStoreEntity, client, address), Promise.reject(error)]
        ])
        .dispatch(fetchStoreRequest(address))
        .put(fetchStoreFailure(error.message))
        .silentRun()
    })
  })

  describe('when fetch store entity returns null', () => {
    it('should put a fetch store failure action with a not found error', () => {
      return expectSaga(storeSaga, client)
        .provide([[call(fetchStoreEntity, client, address), null]])
        .dispatch(fetchStoreRequest(address))
        .put(fetchStoreFailure('Store not found'))
        .silentRun()
    })
  })

  describe('when fetch store entity returns an entity', () => {
    it('should put a fetch store success action with the entity mapped to a user store', () => {
      return expectSaga(storeSaga, client)
        .provide([
          [
            call(fetchStoreEntity, client, address),
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
        .dispatch(fetchStoreRequest(address))
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
