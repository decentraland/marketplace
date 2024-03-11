import * as contentClient from 'dcl-catalyst-client/dist/client/ContentClient'
import { builderAPI } from '../modules/vendor/decentraland/builder/api'
import { Asset } from '../modules/asset/types'
import { getSmartWearableRequiredPermissions, getSmartWearableSceneContent, getSmartWearableVideoShowcase } from './asset'

jest.mock('../modules/vendor/decentraland/builder/api', () => ({
  builderAPI: {
    fetchItemContent: jest.fn()
  }
}))

const anSWUrn = 'aUrn'
const smartWearable = {
  contractAddress: '0xcontractAddress',
  itemId: 'itemId',
  urn: anSWUrn
} as Asset
const entity = [{ content: [{ file: 'scene.json', hash: 'aHash' }] }]
let SWSceneContent = {
  main: 'bin/game.js',
  scene: {
    parcels: ['100,100'],
    base: '100,100'
  },
  requiredPermissions: ['USE_WEB3_API', 'OPEN_EXTERNAL_LINK']
}
let clientMock: jest.SpyInstance
let fetchItemContentMock: jest.Mock
let SWSceneContentBuffer: ArrayBuffer

beforeEach(() => {
  clientMock = jest.spyOn(contentClient, 'createContentClient')
  fetchItemContentMock = builderAPI.fetchItemContent as jest.Mock
  SWSceneContentBuffer = Buffer.from(JSON.stringify(SWSceneContent))
})

describe('when getting a smart wearable scene content', () => {
  describe('and the smart wearable does not have an entity', () => {
    beforeEach(() => {
      clientMock.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce([])
      })
    })

    it('should return undefined', async () => {
      expect(await getSmartWearableSceneContent(anSWUrn)).toBe(undefined)
    })
  })

  describe('and the smart wearable does not have a valid entity', () => {
    beforeEach(() => {
      clientMock.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce([{ id: 'anId' }])
      })
    })

    it('should return undefined', async () => {
      expect(await getSmartWearableSceneContent(anSWUrn)).toBe(undefined)
    })
  })

  describe('and the smart wearable have a valid entity', () => {
    beforeEach(() => {
      clientMock.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce(entity),
        downloadContent: jest.fn().mockResolvedValueOnce(SWSceneContentBuffer)
      })
    })

    it('should return a scene content json', async () => {
      expect(await getSmartWearableSceneContent(anSWUrn)).toStrictEqual(SWSceneContent)
    })
  })
})

describe('when getting a smart wearable required permissions', () => {
  describe('and the smart wearable does not have required permissions', () => {
    beforeEach(() => {
      SWSceneContent = { ...SWSceneContent, requiredPermissions: [] }
      SWSceneContentBuffer = Buffer.from(JSON.stringify(SWSceneContent))
      clientMock.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce(entity),
        downloadContent: jest.fn().mockResolvedValueOnce(SWSceneContentBuffer)
      })
    })

    it('should return an empty array', async () => {
      expect(await getSmartWearableRequiredPermissions(anSWUrn)).toStrictEqual([])
    })
  })

  describe('and the smart wearable have required permissions', () => {
    beforeEach(() => {
      clientMock.mockReturnValueOnce({
        fetchEntitiesByPointers: jest.fn().mockResolvedValueOnce(entity),
        downloadContent: jest.fn().mockResolvedValueOnce(SWSceneContentBuffer)
      })
    })

    it('should return an array with the required permission', async () => {
      expect(await getSmartWearableRequiredPermissions(anSWUrn)).toStrictEqual(SWSceneContent.requiredPermissions)
    })
  })
})

describe('when getting a smart wearable video showcase', () => {
  describe.each([null, undefined])('and the asset itemId is %s', itemId => {
    it('should return undefined', async () => {
      expect(
        await getSmartWearableVideoShowcase({
          ...smartWearable,
          itemId
        } as Asset)
      ).toBe(undefined)
    })
  })

  describe('and the builder api fails', () => {
    beforeEach(() => {
      fetchItemContentMock.mockRejectedValueOnce(new Error('aError'))
    })

    it('should return undefined', async () => {
      expect(await getSmartWearableVideoShowcase(smartWearable)).toBe(undefined)
    })
  })

  describe('and the smart wearable does not have a video in the content', () => {
    beforeEach(() => {
      fetchItemContentMock.mockResolvedValueOnce({})
    })

    it('should return undefined', async () => {
      expect(await getSmartWearableVideoShowcase(smartWearable)).toBe(undefined)
    })
  })

  describe('and the smart wearable has a video', () => {
    const content = {
      'scene.json': 'aHash',
      'video.mp4': 'aVideoHash'
    }

    beforeEach(() => {
      fetchItemContentMock.mockResolvedValueOnce(content)
    })

    it('should return the video hash', async () => {
      expect(await getSmartWearableVideoShowcase(smartWearable)).toBe('aVideoHash')
    })
  })
})
