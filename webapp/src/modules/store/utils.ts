import { LinkType, Store } from './types'
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
    website: getLink(LinkType.WEBSITE),
    facebook: getLink(LinkType.FACEBOOK),
    twitter: getLink(LinkType.TWITTER),
    discord: getLink(LinkType.DISCORD),
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

  function getLink(type: LinkType) {
    return metadata.links.find(link => link.name === type)?.url || ''
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

    pushLink(LinkType.WEBSITE)
    pushLink(LinkType.FACEBOOK)
    pushLink(LinkType.TWITTER)
    pushLink(LinkType.DISCORD)

    return links

    function pushLink(type: LinkType) {
      if (store[type]) {
        links.push({ name: type, url: store[type] })
      }
    }
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

export const linkStartWiths: Record<LinkType, string> = {
  [LinkType.WEBSITE]: 'https://',
  [LinkType.FACEBOOK]: 'https://www.facebook.com/',
  [LinkType.TWITTER]: 'https://www.twitter.com/',
  [LinkType.DISCORD]: 'https://discord.com/channels/'
}

export const isValidLink = (type: LinkType, link: string) => {
  switch (type) {
    case LinkType.WEBSITE:
      return link.startsWith(linkStartWiths.website)
    case LinkType.FACEBOOK:
      return link.startsWith(linkStartWiths.facebook)
    case LinkType.TWITTER:
      return link.startsWith(linkStartWiths.twitter)
    case LinkType.DISCORD:
      return link.startsWith(linkStartWiths.discord)
    default:
      throw new Error(`Invalid LinkType '${type}'`)
  }
}
