import { Store as CatalystStore } from '@dcl/schemas'
import { Entity } from 'dcl-catalyst-commons'
import { Store } from './types'
import { toStore } from './utils'

jest.mock('../../lib/environment', () => ({
  peerUrl: 'http://peer.com'
}))

describe('when mapping am entity to a store', () => {
  let mockEntity: Entity
  let mockStore: Store

  beforeEach(() => {
    mockEntity = {
      id: 'id',
      pointers: ['id'],
      timestamp: 100,
      type: 'store' as any,
      content: [],
      metadata: {
        images: [],
        description: 'description',
        id: 'id',
        links: [],
        owner: 'owner',
        version: 1
      } as CatalystStore
    }

    mockStore = {
      cover: '',
      coverName: '',
      description: mockEntity.metadata.description,
      discord: '',
      facebook: '',
      owner: mockEntity.metadata.owner,
      twitter: '',
      website: ''
    }
  })

  describe('when metadata is not present in the entity', () => {
    it('should throw with metadata not present error', () => {
      const error = 'Metadata not found'
      const entity = { ...mockEntity, metadata: undefined }

      expect(() => toStore(entity)).toThrow(error)
    })
  })

  describe('when reference cannot be determined from metadata image', () => {
    it('should leave cover and coverName empty', () => {
      const store = toStore(mockEntity)

      expect(store).toEqual(mockStore)
    })
  })

  describe('when facebook, discord, twitter and website links can be obtained from entity', () => {
    const facebook = 'http://www.facebook.com'
    const discord = 'http://www.discord.com'
    const twitter = 'http://www.twitter.com'
    const website = 'http://www.website.com'

    beforeEach(() => {
      mockEntity = {
        ...mockEntity,
        metadata: {
          ...mockEntity.metadata,
          links: [
            { name: 'facebook', url: facebook },
            { name: 'discord', url: discord },
            { name: 'twitter', url: twitter },
            { name: 'website', url: website }
          ]
        } as CatalystStore
      }

      mockStore = {
        ...mockStore,
        facebook,
        discord,
        twitter,
        website
      }
    })

    it('should complete cover and coverName', () => {
      const store = toStore(mockEntity)

      expect(store).toEqual(mockStore)
    })
  })
})
