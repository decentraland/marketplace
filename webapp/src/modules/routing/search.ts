import { NFTCategory } from '../nft/types'
import { WearableCategory } from '../nft/wearable/types'

export enum Section {
  ALL = 'all',
  LAND = 'land',
  PARCELS = 'parcels',
  ESTATES = 'estates',
  WEARABLES = 'wearables',

  WEARABLES_HEAD = 'wearables_head',
  WEARABLES_EYEBROWS = 'wearables_eyebrows',
  WEARABLES_EYES = 'wearables_eyes',
  WEARABLES_FACIAL_HAIR = 'wearables_facial_hair',
  WEARABLES_HAIR = 'wearables_hair',
  WEARABLES_MOUTH = 'wearables_mouth',

  WEARABLES_UPPER_BODY = 'wearables_upper_body',
  WEARABLES_LOWER_BODY = 'wearables_lower_body',
  WEARABLES_FEET = 'wearables_feet',

  WEARABLES_ACCESORIES = 'wearables_accesories',
  WEARABLES_EARRING = 'wearables_earring',
  WEARABLES_EYEWEAR = 'wearables_eyewear',
  WEARABLES_HAT = 'wearables_hat',
  WEARABLES_HELMET = 'wearables_helmet',
  WEARABLES_MASK = 'wearables_mask',
  WEARABLES_TIARA = 'wearables_tiara',
  WEARABLES_TOP_HEAD = 'wearables_top_head',

  ENS = 'ens'
}

export enum SortBy {
  NAME = 'name',
  NEWEST = 'newest',
  RECENTLY_LISTED = 'recently_listed',
  CHEAPEST = 'cheapest'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type SearchOptions = {
  page?: number
  section?: Section
  sortBy?: SortBy
  onlyOnSale?: boolean
}

export function getSearchParams(options?: SearchOptions) {
  let params: URLSearchParams | undefined
  if (options) {
    params = new URLSearchParams()
    if (options.page) {
      params.set('page', options.page.toString())
    }
    if (options.section) {
      params.set('section', options.section)
    }
    if (options.sortBy) {
      params.set('sortBy', options.sortBy)
    }
    if (options.onlyOnSale !== undefined) {
      params.set('onlyOnSale', options.onlyOnSale.toString())
    }
  }
  return params
}

export function getSearchCategory(section: Section) {
  switch (section) {
    case Section.PARCELS:
      return NFTCategory.PARCEL
    case Section.ESTATES:
      return NFTCategory.ESTATE
    case Section.WEARABLES:
    case Section.WEARABLES_HEAD:
    case Section.WEARABLES_EYEBROWS:
    case Section.WEARABLES_EYES:
    case Section.WEARABLES_FACIAL_HAIR:
    case Section.WEARABLES_HAIR:
    case Section.WEARABLES_MOUTH:
    case Section.WEARABLES_UPPER_BODY:
    case Section.WEARABLES_LOWER_BODY:
    case Section.WEARABLES_FEET:
    case Section.WEARABLES_ACCESORIES:
    case Section.WEARABLES_EARRING:
    case Section.WEARABLES_EYEWEAR:
    case Section.WEARABLES_HAT:
    case Section.WEARABLES_HELMET:
    case Section.WEARABLES_MASK:
    case Section.WEARABLES_TIARA:
    case Section.WEARABLES_TOP_HEAD:
      return NFTCategory.WEARABLE
    case Section.ENS:
      return NFTCategory.ENS
  }
}

export function getSearchWearableCategory(section: Section) {
  switch (section) {
    case Section.WEARABLES_EYEBROWS:
      return WearableCategory.EYEBROWS
    case Section.WEARABLES_EYES:
      return WearableCategory.EYES
    case Section.WEARABLES_FACIAL_HAIR:
      return WearableCategory.FACIAL_HAIR
    case Section.WEARABLES_HAIR:
      return WearableCategory.HAIR
    case Section.WEARABLES_MOUTH:
      return WearableCategory.MOUTH
    case Section.WEARABLES_UPPER_BODY:
      return WearableCategory.UPPER_BODY
    case Section.WEARABLES_LOWER_BODY:
      return WearableCategory.LOWER_BODY
    case Section.WEARABLES_FEET:
      return WearableCategory.FEET
    case Section.WEARABLES_EARRING:
      return WearableCategory.EARRING
    case Section.WEARABLES_EYEWEAR:
      return WearableCategory.EYEWEAR
    case Section.WEARABLES_HAT:
      return WearableCategory.HAT
    case Section.WEARABLES_HELMET:
      return WearableCategory.HELMET
    case Section.WEARABLES_MASK:
      return WearableCategory.MASK
    case Section.WEARABLES_TIARA:
      return WearableCategory.TIARA
    case Section.WEARABLES_TOP_HEAD:
      return WearableCategory.TOP_HEAD
  }
}

