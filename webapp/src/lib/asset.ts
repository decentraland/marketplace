import { createContentClient } from 'dcl-catalyst-client/dist/client/ContentClient'
import { createFetchComponent } from '@well-known-components/fetch-component'
import { peerUrl } from './environment'

export const getSmartWearableSceneContent = async (
  urn: string
): Promise<Record<string, unknown> | undefined> => {
  const contentClient = createContentClient({
    url: `${peerUrl}/content`,
    fetcher: createFetchComponent()
  })
  try {
    const wearableEntity = await contentClient.fetchEntitiesByPointers([urn])
    if (wearableEntity.length > 0) {
      const scene = wearableEntity[0].content?.find(entity =>
        entity.file.endsWith('scene.json')
      )
      if (scene) {
        const wearableScene = await contentClient.downloadContent(scene.hash)

        const enc = new TextDecoder('utf-8')
        const data = new Uint8Array(wearableScene)
        return JSON.parse(enc.decode(data))
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export const getSmartWearableRequiredPermissions = async (
  urn: string
): Promise<string[]> => {
  const wearableSceneContent = await getSmartWearableSceneContent(urn)
  return wearableSceneContent
    ? (wearableSceneContent.requiredPermissions as string[])
    : []
}
