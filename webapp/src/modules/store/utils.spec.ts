import { Entity } from '@dcl/schemas'
import { EntityVersion } from 'dcl-catalyst-commons'
import { Store, StoreEntityMetadata } from './types'
import {
  getPeerCoverUrl,
  getStoreUrn,
  getEntityMetadataFromStore,
  getStoreFromEntity,
  getEntityMetadataFilesFromStore
} from './utils'

global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

jest.mock('../../lib/environment', () => ({
  peerUrl: 'http://peer.com'
}))

const facebook = 'http://www.facebook.com'
const discord = 'http://www.discord.com'
const twitter = 'http://www.twitter.com'
const website = 'http://www.website.com'

let mockMetadata: StoreEntityMetadata
let mockEntity: Entity
let mockStore: Store

beforeEach(() => {
  mockMetadata = {
    images: [],
    description: 'description',
    id: 'id',
    links: [],
    owner: 'owner',
    version: 1
  }

  mockEntity = {
    id: 'id',
    pointers: ['id'],
    timestamp: 100,
    type: 'store' as any,
    content: [],
    metadata: mockMetadata,
    version: EntityVersion.V2
  }

  mockStore = {
    cover: '',
    coverName: '',
    description: mockMetadata.description,
    discord: '',
    facebook: '',
    owner: mockMetadata.owner,
    twitter: '',
    website: ''
  }
})

describe('when getting a store from an entity', () => {
  describe('when metadata is not present in the entity', () => {
    it('should throw with metadata not present error', () => {
      const error = 'Metadata not found'
      const entity = { ...mockEntity, metadata: undefined }

      expect(() => getStoreFromEntity(entity)).toThrow(error)
    })
  })

  describe('when reference cannot be determined from metadata image', () => {
    it('should return a store with cover and coverName empty', () => {
      expect(getStoreFromEntity(mockEntity)).toEqual(mockStore)
    })
  })

  describe('when reference can be determined from metadata image', () => {
    const file = 'cover/cover-file.png'

    beforeEach(() => {
      mockEntity = {
        ...mockEntity,
        content: [
          {
            file,
            hash: 'hash'
          }
        ],
        metadata: {
          ...mockEntity.metadata,
          images: [
            {
              file,
              name: 'cover'
            }
          ]
        } as StoreEntityMetadata
      }

      mockStore = {
        ...mockStore,
        cover: getPeerCoverUrl('hash'),
        coverName: 'cover/cover-file.png'
      }
    })

    it('should return a store with cover and coverName with values', () => {
      expect(getStoreFromEntity(mockEntity)).toEqual(mockStore)
    })
  })

  describe('when facebook, discord, twitter and website links can be obtained from entity', () => {
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
        } as StoreEntityMetadata
      }

      mockStore = {
        ...mockStore,
        facebook,
        discord,
        twitter,
        website
      }
    })

    it('should return a store those links in it', () => {
      expect(getStoreFromEntity(mockEntity)).toEqual(mockStore)
    })
  })
})

describe('when getting entity metadata from a store', () => {
  describe('when facebook, discord, twitter and website links are present in the store', () => {
    beforeEach(() => {
      mockStore = {
        ...mockStore,
        facebook,
        discord,
        twitter,
        website
      }

      mockMetadata = {
        ...mockMetadata,
        id: getStoreUrn('owner'),
        links: [
          { name: 'website', url: website },
          { name: 'facebook', url: facebook },
          { name: 'twitter', url: twitter },
          { name: 'discord', url: discord }
        ]
      }
    })

    it('should return entity metadata containing them as links', () => {
      expect(getEntityMetadataFromStore(mockStore)).toEqual(mockMetadata)
    })
  })

  describe('when cover and coverName are present in the store', () => {
    beforeEach(() => {
      mockStore = {
        ...mockStore,
        cover: 'foo',
        coverName: 'bar'
      }

      mockMetadata = {
        ...mockMetadata,
        id: getStoreUrn('owner'),
        images: [
          {
            name: 'cover',
            file: 'bar'
          }
        ]
      }
    })

    it('should return entity metadata with the file array with an entry', () => {
      expect(getEntityMetadataFromStore(mockStore)).toEqual(mockMetadata)
    })
  })
})

describe('when getting entity files from store', () => {
  describe('when the store has no cover', () => {
    it('should return an empty map', async () => {
      const result = await getEntityMetadataFilesFromStore(mockStore)
      expect(result).toEqual(new Map<string, Store>())
    })
  })

  describe('when the store has cover', () => {
    beforeEach(() => {
      mockStore = {
        ...mockStore,
        cover: 'some-cover',
        coverName: 'some-cover-name'
      }

      mockFetch.mockResolvedValueOnce({
        arrayBuffer: () => Promise.resolve([])
      } as any)
    })

    it('should return a map with an entry with the store coverName as key', async () => {
      const result = await getEntityMetadataFilesFromStore(mockStore)
      expect(result).toEqual(
        new Map<string, Buffer>([['some-cover-name', expect.anything()]])
      )
    })
  })
})
