import { createContentClient } from 'dcl-catalyst-client/dist/client/ContentClient'
import { createFetchComponent } from '@well-known-components/fetch-component'
import { Asset } from '../modules/asset/types'
import { builderAPI } from '../modules/vendor/decentraland/builder/api'
import { peerUrl } from './environment'

export const SCENE_PATH = 'scene.json'
export const VIDEO_PATH = 'video.mp4'

const getContentClient = () =>
  createContentClient({
    url: `${peerUrl}/content`,
    fetcher: createFetchComponent()
  })

export const getSmartWearableSceneContent = async (urn: string): Promise<Record<string, unknown> | undefined> => {
  const contentClient = getContentClient()
  const wearableEntity = await contentClient.fetchEntitiesByPointers([urn])

  if (wearableEntity.length > 0) {
    const scene = wearableEntity[0].content?.find(entity => entity.file.endsWith(SCENE_PATH))

    if (scene) {
      const wearableScene = await contentClient.downloadContent(scene.hash)

      const enc = new TextDecoder('utf-8')
      const data = new Uint8Array(wearableScene)
      return JSON.parse(enc.decode(data)) as Record<string, unknown>
    }
  }
}

export const getSmartWearableRequiredPermissions = async (urn: string): Promise<string[]> => {
  const wearableSceneContent = await getSmartWearableSceneContent(urn)
  return wearableSceneContent ? (wearableSceneContent.requiredPermissions as string[]) : []
}

export const getSmartWearableVideoShowcase = async (asset: Asset): Promise<string | undefined> => {
  try {
    const { contractAddress, itemId } = asset

    if (!itemId) return undefined

    const contents = await builderAPI.fetchItemContent(contractAddress, itemId)

    const videoContentKey = Object.keys(contents).find(key => key.endsWith(VIDEO_PATH))

    return videoContentKey ? contents[videoContentKey] : undefined
  } catch (error) {
    return undefined
  }
}
