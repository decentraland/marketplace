import * as contentClient from 'dcl-catalyst-client/dist/client/ContentClient'
import {
  getSmartWearableRequiredPermissions,
  getSmartWearableSceneContent,
  getSmartWearableVideoShowcase
} from './asset'

const anSWUrn = 'aUrn'
const entity = [{ content: [{ file: 'scene.json', hash: 'aHash' }] }]
let SWSceneContent = {
  main: 'bin/game.js',
  scene: {
    parcels: ['100,100'],
    base: '100,100'
  },
  requiredPermissions: ['USE_WEB3_API', 'OPEN_EXTERNAL_LINK']
}
let mockClient: jest.SpyInstance
let SWSceneContentBuffer: ArrayBuffer

beforeEach(() => {
  mockClient = jest.spyOn(contentClient, 'createContentClient')
  SWSceneContentBuffer = Buffer.from(JSON.stringify(SWSceneContent))
})

describe('when getting a smart wearable scene content', () => {
  describe('and the smart wearable does not have an entity', () => {
    beforeEach(() => {
      mockClient = mockClient.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce([])
      })
    })

    it('should return undefined', async () => {
      expect(await getSmartWearableSceneContent(anSWUrn)).toBe(undefined)
    })
  })

  describe('and the smart wearable does not have a valid entity', () => {
    beforeEach(() => {
      mockClient.mockReturnValueOnce({
        fetchEntitiesByPointers: jest
          .fn()
          .mockResolvedValueOnce([{ id: 'anId' }])
      })
    })

    it('should return undefined', async () => {
      expect(await getSmartWearableSceneContent(anSWUrn)).toBe(undefined)
    })
  })

  describe('and the smart wearable have a valid entity', () => {
    beforeEach(() => {
      mockClient.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce(entity),
        downloadContent: jest.fn().mockResolvedValueOnce(SWSceneContentBuffer)
      })
    })

    it('should return a scene content json', async () => {
      expect(await getSmartWearableSceneContent(anSWUrn)).toStrictEqual(
        SWSceneContent
      )
    })
  })
})

describe('when getting a smart wearable required permissions', () => {
  describe('and the smart wearable does not have required permissions', () => {
    beforeEach(() => {
      SWSceneContent = { ...SWSceneContent, requiredPermissions: [] }
      SWSceneContentBuffer = Buffer.from(JSON.stringify(SWSceneContent))
      mockClient.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce(entity),
        downloadContent: jest.fn().mockResolvedValueOnce(SWSceneContentBuffer)
      })
    })

    it('should return an empty array', async () => {
      expect(await getSmartWearableRequiredPermissions(anSWUrn)).toStrictEqual(
        []
      )
    })
  })

  describe('and the smart wearable have required permissions', () => {
    beforeEach(() => {
      mockClient.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce(entity),
        downloadContent: jest.fn().mockResolvedValueOnce(SWSceneContentBuffer)
      })
    })

    it('should return an array with the required permission', async () => {
      expect(await getSmartWearableRequiredPermissions(anSWUrn)).toStrictEqual(
        SWSceneContent.requiredPermissions
      )
    })
  })
})

describe('when getting a smart wearable video showcase', () => {
  describe('and the smart wearable does not have an entity', () => {
    beforeEach(() => {
      mockClient = mockClient.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce([])
      })
    })

    it('should return undefined', async () => {
      expect(await getSmartWearableVideoShowcase(anSWUrn)).toBe(undefined)
    })
  })

  describe('and the smart wearable has an entity', () => {
    describe('and the smart wearable does not have the video in its content', () => {
      beforeEach(() => {
        mockClient.mockReturnValueOnce({
          fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce(entity)
        })
      })

      it('should return undefined', async () => {
        expect(await getSmartWearableVideoShowcase(anSWUrn)).toBeUndefined()
      })
    })

    describe('and the smart wearable have video showcase', () => {
      const entityWithVideo = [
        {
          content: [
            { file: 'scene.json', hash: 'aHash' },
            { file: 'video.mp4', hash: 'aVideoHash' }
          ]
        }
      ]

      beforeEach(() => {
        mockClient.mockReturnValueOnce({
          fetchEntitiesByPointers: jest
            .fn()
            .mockResolvedValueOnce(entityWithVideo)
        })
      })

      it('should return the video hash', async () => {
        expect(await getSmartWearableVideoShowcase(anSWUrn)).toBe('aVideoHash')
      })
    })
  })
})
