import {
  BuildEntityWithoutFilesOptions,
  CatalystClient,
  DeploymentPreparationData
} from 'dcl-catalyst-client'
import { Entity, EntityContentItemReference } from 'dcl-catalyst-commons'
import { LinkType, Store, StoreEntityMetadata } from './types'
import { peerUrl } from '../../lib/environment'
import { Authenticator, AuthIdentity } from 'dcl-crypto'

export const getPeerCoverUrl = (hash: string) =>
  `${peerUrl}/content/contents/${hash}`

export const getStoreUrn = (address: string) =>
  `urn:decentraland:marketplace:store:${address}`

export const getPrefixedCoverName = (coverName: string) =>
  coverName.startsWith('cover/') ? coverName : `cover/${coverName}`

export const getEmptyStore = (): Store => ({
  owner: '',
  cover: '',
  coverName: '',
  description: '',
  website: '',
  facebook: '',
  twitter: '',
  discord: ''
})

// Mappings

export const getStoreFromEntity = (entity: Entity): Store => {
  const metadata: StoreEntityMetadata | undefined = entity.metadata
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

export const getEntityMetadataFromStore = (
  store: Store,
  address: string
): StoreEntityMetadata => {
  const links: StoreEntityMetadata['links'] = []

  const pushLink = (type: LinkType) => {
    if (store[type]) {
      links.push({ name: type, url: store[type] })
    }
  }

  pushLink(LinkType.WEBSITE)
  pushLink(LinkType.FACEBOOK)
  pushLink(LinkType.TWITTER)
  pushLink(LinkType.DISCORD)

  const images: StoreEntityMetadata['images'] = []

  if (store.cover && store.coverName) {
    images.push({ name: 'cover', file: store.coverName })
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

export const getEntityMetadataFilesFromStore = async (store: Store) => {
  const files = new Map<string, Buffer>()

  if (store.cover) {
    const response: Response = await fetch(store.cover)
    const arrayBuffer: ArrayBuffer = await response.arrayBuffer()
    const key = store.coverName

    files.set(key, Buffer.from(arrayBuffer))
  }

  return files
}

// Requests

export const fetchStoreEntity = async (
  client: CatalystClient,
  address: string
): Promise<Entity | null> => {
  const type: any = 'store'
  const entities = await client.fetchEntitiesByPointers(type, [address])
  return entities.length === 0 ? null : entities[0]
}

export const deployStoreEntity = async (
  client: CatalystClient,
  identity: AuthIdentity,
  address: string,
  store: Store
) => {
  const metadata = getEntityMetadataFromStore(store, address)
  const files = await getEntityMetadataFilesFromStore(store)

  const options: BuildEntityWithoutFilesOptions = {
    type: 'store' as any,
    pointers: [address],
    metadata,
    timestamp: Date.now()
  }

  const entity: DeploymentPreparationData =
    files.size === 0
      ? await client.buildEntityWithoutNewFiles(options)
      : await client.buildEntity({ ...options, files })

  const authChain = Authenticator.signPayload(identity, entity.entityId)

  return client.deployEntity({ ...entity, authChain })
}

// Validations

export const linkStartWiths: Record<LinkType, string> = {
  [LinkType.WEBSITE]: 'https://',
  [LinkType.FACEBOOK]: 'https://www.facebook.com/',
  [LinkType.TWITTER]: 'https://www.twitter.com/',
  [LinkType.DISCORD]: 'https://discord.com/channels/'
}

export const getIsValidLink = (type: LinkType, link: string) => {
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
