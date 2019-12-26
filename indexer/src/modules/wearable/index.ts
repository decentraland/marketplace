import { log } from '@graphprotocol/graph-ts'

import { Wearable as WearableEntity } from '../../entities/schema'
import { Wearable } from './Wearable'
import { halloween_2019 } from './halloween_2019'
import { exclusive_masks } from './exclusive_masks'
import { xmas_2019 } from './xmas_2019'

export function upsertWearable(tokenURI: string): string {
  // https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/halloween_2019/wearables/funny_skull_mask/1
  let id = getWearableIdFromTokenURI(tokenURI)
  if (id == '') {
    log.error('Coud not get a wearable id from tokenURI {}', [tokenURI])
    return ''
  }

  let allCollections: Wearable[][] = [
    halloween_2019,
    exclusive_masks,
    xmas_2019
  ]
  for (let i = 1; i < allCollections.length; i++) {
    let wearable = buildWearable(id, allCollections[i])
    if (wearable.id == id) {
      wearable.save()
      return wearable.id
    }
  }

  log.error('Coud not find a wearable for the id {} found on the tokenURI {}', [
    id,
    tokenURI
  ])
  return ''
}

function buildWearable(id: string, collection: Wearable[]): WearableEntity {
  for (let i = 1; i < collection.length; i++) {
    let representation = collection[i]
    if (id == representation.id) {
      let wearable = new WearableEntity(id)
      wearable.name = representation.name
      wearable.description = representation.description
      wearable.category = representation.category
      wearable.rarity = representation.rarity
      return wearable
    }
  }

  return new WearableEntity('')
}

function getWearableIdFromTokenURI(tokenURI: string): string {
  // https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/halloween_2019/wearables/funny_skull_mask/1
  let splitted = tokenURI.split('/')
  if (splitted.length != 11) {
    return ''
  }

  let ids = splitted.slice(-2)
  return ids[0]
}
