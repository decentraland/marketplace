import { LinkType, Store } from './types'
import { Store as CatalystStore } from '@dcl/schemas'
import { peerUrl } from '../../lib/environment'
import { Entity, EntityContentItemReference } from 'dcl-catalyst-commons'
import { CatalystClient } from 'dcl-catalyst-client'

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

export const fetchStoreEntity = async (
  client: CatalystClient,
  address: string
): Promise<Entity | null> => {
  const type: any = 'store'
  const entities = await client.fetchEntitiesByPointers(type, [address])
  return entities.length === 0 ? null : entities[0]
}

export const toStore = (entity: Entity): Store => {
  const metadata: CatalystStore | undefined = entity.metadata
  const content: EntityContentItemReference[] | undefined = entity.content

  if (!metadata) {
    throw new Error('Metadata not found')
  }

  let cover = ''
  let coverName = ''

  const image = metadata.images.find(image => image.name === 'cover')

  const reference =
    image && content
      ? content.find((cont: any) => cont.file === image.file)
      : undefined

  if (reference) {
    cover = getPeerCoverUrl(reference.hash)
    coverName = reference.file
  }

  const getLink = (type: LinkType) =>
    metadata.links.find(link => link.name === type)?.url || ''

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
}

export const getPeerCoverUrl = (hash: string) =>
  `${peerUrl}/content/contents/${hash}`

export const toCatalystStore = (
  store: Store,
  address: string,
  hasDifferentCover: boolean
): CatalystStore => {
  const links: CatalystStore['links'] = []

  const pushLink = (type: LinkType) => {
    if (store[type]) {
      links.push({ name: type, url: store[type] })
    }
  }

  pushLink(LinkType.WEBSITE)
  pushLink(LinkType.FACEBOOK)
  pushLink(LinkType.TWITTER)
  pushLink(LinkType.DISCORD)

  const images: CatalystStore['images'] = []

  if (store.cover && store.coverName) {
    hasDifferentCover
      ? images.push({ name: 'cover', file: `cover/${store.coverName}` })
      : images.push({ name: 'cover', file: store.coverName })
  }

  return {
    id: getStoreUrn(address),
    description: store.description,
    images,
    links,
    owner: address,
    version: 1
  }
}

export const getStoreUrn = (address: string) =>
  `urn:decentraland:marketplace:store:${address}`

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
