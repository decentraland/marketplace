import { createContentClient } from 'dcl-catalyst-client/dist/client/ContentClient'
import { createFetchComponent } from '@well-known-components/fetch-component'
import { peerUrl } from './environment'

const contentClient = createContentClient({
  url: `${peerUrl}/content`,
  fetcher: createFetchComponent()
})

export const getSmartWearableSceneContent = async (
  urn: string
): Promise<Record<string, unknown> | undefined> => {
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
}

export const getSmartWearableRequiredPermissions = async (
  urn: string
): Promise<string[]> => {
  const wearableSceneContent = await getSmartWearableSceneContent(urn)
  return wearableSceneContent
    ? (wearableSceneContent.requiredPermissions as string[])
    : []
}

export const getSmartWearableVideoShowcase = async (
  urn: string
): Promise<string | undefined> => {
  const wearableEntity = await contentClient.fetchEntitiesByPointers([urn])

  const video = wearableEntity[0]?.content?.find(entity =>
    entity.file.endsWith('video.mp4')
  )

  return video ? video.hash : undefined
}
