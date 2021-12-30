import { Store } from './types'
import { Store as CatalystStore } from '@dcl/schemas'
import { peerUrl } from '../../lib/environment'

export const getEmptyLocalStore = (): Store => ({
  owner: '',
  cover: '',
  coverName: '',
  description: '',
  website: '',
  facebook: '',
  twitter: '',
  discord: ''
})

export const toStore = (entity: any): Store => {
  const metadata: CatalystStore = entity.metadata

  const [cover, coverName] = getCoverAndName()

  return {
    cover,
    coverName,
    description: metadata.description,
    website: getLink('website'),
    facebook: getLink('facebook'),
    twitter: getLink('twitter'),
    discord: getLink('discord'),
    owner: metadata.owner
  }

  function getCoverAndName(): [string, string] {
    const image = metadata.images.find(image => image.name === 'cover')

    if (image) {
      const content = entity.content.find(
        (cont: any) => cont.file === image.file
      )

      if (content) {
        return [`${peerUrl}/content/contents/${content.hash}`, content.file]
      }
    }

    return ['', '']
  }

  function getLink(name: string) {
    return metadata.links.find(link => link.name === name)?.url || ''
  }
}

export const toCatalystStore = (
  store: Store,
  address: string,
  hasDifferentCover: boolean
): CatalystStore => {
  return {
    id: `urn:decentraland:marketplace:store:${address}`,
    description: store.description,
    images: getImages(),
    links: getLinks(),
    owner: address,
    version: 1
  }

  function getLinks() {
    const links: CatalystStore['links'] = []

    if (store.website) {
      links.push({ name: 'website', url: store.website })
    }

    if (store.facebook) {
      links.push({ name: 'facebook', url: store.facebook })
    }

    if (store.twitter) {
      links.push({ name: 'twitter', url: store.twitter })
    }

    if (store.discord) {
      links.push({ name: 'discord', url: store.discord })
    }

    return links
  }

  function getImages() {
    let images: CatalystStore['images'] = []

    if (store.cover && store.coverName) {
      if (hasDifferentCover) {
        images.push({ name: 'cover', file: `cover/${store.coverName}` })
      } else {
        images.push({ name: 'cover', file: store.coverName })
      }
    }

    return images
  }
}
