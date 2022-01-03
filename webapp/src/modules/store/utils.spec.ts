import { Store as CatalystStore } from '@dcl/schemas'
import { Entity } from 'dcl-catalyst-commons'
import { Store } from './types'
import { getPeerCoverUrl, getStoreUrn, toCatalystStore, toStore } from './utils'

jest.mock('../../lib/environment', () => ({
  peerUrl: 'http://peer.com'
}))

const facebook = 'http://www.facebook.com'
const discord = 'http://www.discord.com'
const twitter = 'http://www.twitter.com'
const website = 'http://www.website.com'

let mockMetadata: CatalystStore
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
    metadata: mockMetadata
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

describe('when mapping am entity to a store', () => {
  describe('when metadata is not present in the entity', () => {
    it('should throw with metadata not present error', () => {
      const error = 'Metadata not found'
      const entity = { ...mockEntity, metadata: undefined }

      expect(() => toStore(entity)).toThrow(error)
    })
  })

  describe('when reference cannot be determined from metadata image', () => {
    it('should return a store with cover and coverName empty', () => {
      expect(toStore(mockEntity)).toEqual(mockStore)
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
        } as CatalystStore
      }

      mockStore = {
        ...mockStore,
        cover: getPeerCoverUrl('hash'),
        coverName: 'cover/cover-file.png'
      }
    })

    it('should return a store with cover and coverName with values', () => {
      expect(toStore(mockEntity)).toEqual(mockStore)
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
      expect(toStore(mockEntity)).toEqual(mockStore)
    })
  })
})

describe('when mapping a store to entity metadata', () => {
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
      expect(toCatalystStore(mockStore, 'owner', false)).toEqual(mockMetadata)
    })
  })

  describe('when cover and coverName are present in the store', () => {
    beforeEach(() => {
      mockStore = {
        ...mockStore,
        cover: 'foo',
        coverName: 'bar'
      }
    })

    describe('when argument for has different covers is false', () => {
      beforeEach(() => {
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

      it('should return entity metadata containing an object in the images array with cover as name and bar as file', () => {
        expect(toCatalystStore(mockStore, 'owner', false)).toEqual(mockMetadata)
      })
    })

    describe('when argument for has different covers is false', () => {
      beforeEach(() => {
        mockMetadata = {
          ...mockMetadata,
          id: getStoreUrn('owner'),
          images: [
            {
              name: 'cover',
              file: 'cover/bar'
            }
          ]
        }
      })

      it('should return entity metadata containing an object in the images array with cover as name and cover/bar as file', () => {
        expect(toCatalystStore(mockStore, 'owner', true)).toEqual(mockMetadata)
      })
    })
  })
})
