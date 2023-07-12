import * as contentClient from 'dcl-catalyst-client/dist/client/ContentClient'
import {
  getSmartWearableRequiredPermissions,
  getSmartWearableSceneContent
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
