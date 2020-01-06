import { log } from '@graphprotocol/graph-ts'

import { NFT, Wearable as WearableEntity } from '../../entities/schema'
import { Wearable } from './Wearable'
import { halloween_2019 } from './halloween_2019'
import { exclusive_masks } from './exclusive_masks'
import { xmas_2019 } from './xmas_2019'

export function buildWearableFromNFT(nft: NFT): WearableEntity {
  // https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/halloween_2019/wearables/funny_skull_mask/1
  let wearableId = getWearableIdFromTokenURI(nft.tokenURI)
  if (wearableId == '') {
    log.error('Coud not get a wearable id from tokenURI {} and nft {}', [
      nft.tokenURI,
      nft.id
    ])
    return new WearableEntity('')
  }

  let allCollections: Wearable[][] = [
    halloween_2019,
    exclusive_masks,
    xmas_2019
  ]
  let collectionNames: string[] = [
    'halloween_2019',
    'exclusive_masks',
    'xmas_2019'
  ]
  for (let i = 0; i < allCollections.length; i++) {
    let wearable = findWearable(wearableId, allCollections[i])
    if (wearable.id == wearableId) {
      wearable.id = nft.id
      wearable.collection = collectionNames[i]
      wearable.owner = nft.owner
      return wearable
    }
  }

  log.error(
    'Coud not find a wearable for the id {} found on the tokenURI {} and nft {}',
    [wearableId, nft.tokenURI, nft.id]
  )
  return new WearableEntity('')
}

export function getWearableImage(wearable: WearableEntity): String {
  return (
    'http://wearable-api.decentraland.org/v2/collections/' +
    wearable.collection +
    '/wearables/' +
    wearable.representationId +
    '/image'
  )
}

function findWearable(id: string, collection: Wearable[]): WearableEntity {
  for (let i = 0; i < collection.length; i++) {
    let representation = collection[i]
    if (id == representation.id) {
      // TODO: representation.toEntity()
      let wearable = new WearableEntity(id)
      wearable.representationId = representation.id
      wearable.name = representation.name
      wearable.description = representation.description
      wearable.category = representation.category
      wearable.rarity = representation.rarity
      wearable.bodyShapes = representation.bodyShapes
      return wearable
    }
  }

  return new WearableEntity('')
}

function getWearableIdFromTokenURI(tokenURI: string): string {
  let splitted = tokenURI.split('/')

  // https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/halloween_2019/wearables/funny_skull_mask/1
  // or
  // dcl://halloween_2019/vampire_feet/55
  if (splitted.length == 11 || splitted.length == 5) {
    let ids = splitted.slice(-2)
    return ids[0]
  }

  return ''
}
