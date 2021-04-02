import { log } from '@graphprotocol/graph-ts'

import { NFT, Wearable as WearableEntity } from '../../entities/schema'
import {
  Wearable,
  atari_launch,
  binance_us_collection,
  china_flying,
  community_contest,
  cybermike_cybersoldier_set,
  cz_mercenary_mtz,
  dappcraft_moonminer,
  dc_meta,
  dc_niftyblocksmith,
  dcg_collection,
  dcl_launch,
  dg_fall_2020,
  dg_summer_2020,
  dgtble_headspace,
  digital_alchemy,
  ethermon_wearables,
  exclusive_masks,
  halloween_2019,
  halloween_2020,
  mch_collection,
  meme_dontbuythis,
  mf_sammichgamer,
  ml_liondance,
  ml_pekingopera,
  moonshot_2020,
  pm_dreamverse_eminence,
  pm_outtathisworld,
  rac_basics,
  release_the_kraken,
  rtfkt_x_atari,
  stay_safe,
  sugarclub_yumi,
  tech_tribal_marc0matic,
  threelau_basics,
  winklevoss_capital,
  wonderzone_meteorchaser,
  wonderzone_steampunk,
  wz_wonderbot,
  xmas_2019,
  xmas_2020,
  xmash_up_2020
} from '../../data/wearables'
import * as categories from '../../data/wearables/categories'

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
    atari_launch,
    binance_us_collection,
    china_flying,
    community_contest,
    cybermike_cybersoldier_set,
    cz_mercenary_mtz,
    dappcraft_moonminer,
    dc_meta,
    dc_niftyblocksmith,
    dcg_collection,
    dcl_launch,
    dg_fall_2020,
    dg_summer_2020,
    dgtble_headspace,
    digital_alchemy,
    ethermon_wearables,
    exclusive_masks,
    halloween_2019,
    halloween_2020,
    mch_collection,
    meme_dontbuythis,
    mf_sammichgamer,
    ml_liondance,
    ml_pekingopera,
    moonshot_2020,
    pm_dreamverse_eminence,
    pm_outtathisworld,
    rac_basics,
    release_the_kraken,
    rtfkt_x_atari,
    stay_safe,
    sugarclub_yumi,
    tech_tribal_marc0matic,
    threelau_basics,
    winklevoss_capital,
    wonderzone_meteorchaser,
    wonderzone_steampunk,
    wz_wonderbot,
    xmas_2019,
    xmas_2020,
    xmash_up_2020
  ]
  let collectionNames: string[] = [
    'atari_launch',
    'binance_us_collection',
    'china_flying',
    'community_contest',
    'cybermike_cybersoldier_set',
    'cz_mercenary_mtz',
    'dappcraft_moonminer',
    'dc_meta',
    'dc_niftyblocksmith',
    'dcg_collection',
    'dcl_launch',
    'dg_fall_2020',
    'dg_summer_2020',
    'dgtble_headspace',
    'digital_alchemy',
    'ethermon_wearables',
    'exclusive_masks',
    'halloween_2019',
    'halloween_2020',
    'mch_collection',
    'meme_dontbuythis',
    'mf_sammichgamer',
    'ml_liondance',
    'ml_pekingopera',
    'moonshot_2020',
    'pm_dreamverse_eminence',
    'pm_outtathisworld',
    'rac_basics',
    'release_the_kraken',
    'rtfkt_x_atari',
    'stay_safe',
    'sugarclub_yumi',
    'tech_tribal_marc0matic',
    '3lau_basics', // threelau_basics
    'winklevoss_capital',
    'wonderzone_meteorchaser',
    'wonderzone_steampunk',
    'wz_wonderbot',
    'xmas_2019',
    'xmas_2020',
    'xmash_up_2020'
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

export function getWearableImage(wearable: WearableEntity): string {
  return (
    'https://wearable-api.decentraland.org/v2/collections/' +
    wearable.collection +
    '/wearables/' +
    wearable.representationId +
    '/thumbnail'
  )
}

export function isWearableHead(wearable: WearableEntity): boolean {
  let category = wearable.category
  return (
    category == categories.EYEBROWS ||
    category == categories.EYES ||
    category == categories.FACIAL_HAIR ||
    category == categories.HAIR ||
    category == categories.MOUTH
  )
}

export function isWearableAccessory(wearable: WearableEntity): boolean {
  let category = wearable.category
  return (
    category == categories.EARRING ||
    category == categories.EYEWEAR ||
    category == categories.HAT ||
    category == categories.HELMET ||
    category == categories.MASK ||
    category == categories.TIARA ||
    category == categories.TOP_HEAD
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

export function getWearableIdFromTokenURI(tokenURI: string): string {
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
