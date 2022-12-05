import { Entity } from '@dcl/schemas'
import { Authenticator, AuthIdentity } from '@dcl/crypto'
import {
  BuildEntityWithoutFilesOptions,
  CatalystClient,
  DeploymentPreparationData
} from 'dcl-catalyst-client'
import { EntityContentItemReference } from 'dcl-catalyst-commons'
import { LinkType, Store, StoreEntityMetadata } from './types'
import { peerUrl } from '../../lib/environment'

export const getPeerCoverUrl = (hash: string) =>
  `${peerUrl}/content/contents/${hash}`

export const getStoreUrn = (address: string) =>
  `urn:decentraland:off-chain:marketplace-stores:${address}`

export const getPrefixedCoverName = (coverName: string) =>
  coverName.startsWith('cover/') ? coverName : `cover/${coverName}`

export const getEmptyStore = (props: Partial<Store> = {}): Store => ({
  owner: '',
  cover: '',
  coverName: '',
  description: '',
  website: '',
  facebook: '',
  twitter: '',
  discord: '',
  ...props
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
  store: Store
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

  const { owner } = store

  return {
    id: getStoreUrn(owner),
    description: store.description,
    images,
    links,
    owner,
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
  const urn = getStoreUrn(address)
  const entities = await client.fetchEntitiesByPointers(type, [urn])
  return entities.length === 0 ? null : entities[0]
}

export const deployStoreEntity = async (
  client: CatalystClient,
  identity: AuthIdentity,
  store: Store
) => {
  const { owner } = store
  const metadata = getEntityMetadataFromStore(store)
  const files = await getEntityMetadataFilesFromStore(store)

  const options: BuildEntityWithoutFilesOptions = {
    type: 'store' as any,
    pointers: [getStoreUrn(owner)],
    metadata,
    timestamp: Date.now()
  }

  const entity: DeploymentPreparationData = await client.buildEntity({
    ...options,
    files
  })

  const authChain = Authenticator.signPayload(identity, entity.entityId)

  return client.deployEntity({ ...entity, authChain })
}

// Validations

export const linkStartsWith: Record<LinkType, string> = {
  [LinkType.WEBSITE]: 'https://',
  [LinkType.FACEBOOK]: 'https://www.facebook.com/',
  [LinkType.TWITTER]: 'https://www.twitter.com/',
  [LinkType.DISCORD]: 'https://discord.gg/'
}

export const getIsValidLink = (type: LinkType, link: string) => {
  switch (type) {
    case LinkType.WEBSITE:
      return link.startsWith(linkStartsWith.website)
    case LinkType.FACEBOOK:
      return link.startsWith(linkStartsWith.facebook)
    case LinkType.TWITTER:
      return link.startsWith(linkStartsWith.twitter)
    case LinkType.DISCORD:
      return link.startsWith(linkStartsWith.discord)
    default:
      throw new Error(`Invalid LinkType '${type}'`)
  }
}
