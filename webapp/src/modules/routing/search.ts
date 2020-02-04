import { NFTCategory } from '../nft/types'
import { WearableCategory } from '../nft/wearable/types'

export enum Section {
  ALL = 'all',
  LAND = 'land',
  PARCELS = 'parcels',
  ESTATES = 'estates',
  WEARABLES = 'wearables',
  WEARABLES_TOP = 'wearables_top',
  WEARABLES_BOTTOM = 'wearables_bottom',
  WEARABLES_SHOES = 'wearables_shoes',
  WEARABLES_ACCESORIES = 'wearables_accesories',
  WEARABLES_EYEWEAR = 'wearables_eyewear',
  WEARABLES_EARRING = 'wearables_earring',
  WEARABLES_MASK = 'wearables_mask',
  WEARABLES_HAT = 'wearables_hat',
  WEARABLES_HELMET = 'wearables_helmet'
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
    case Section.WEARABLES_TOP:
    case Section.WEARABLES_BOTTOM:
    case Section.WEARABLES_SHOES:
    case Section.WEARABLES_ACCESORIES:
    case Section.WEARABLES_EYEWEAR:
    case Section.WEARABLES_EARRING:
    case Section.WEARABLES_MASK:
    case Section.WEARABLES_HAT:
    case Section.WEARABLES_HELMET:
      return NFTCategory.WEARABLE
  }
}

export function getSearchWearableCategory(section: Section) {
  switch (section) {
    case Section.WEARABLES_TOP:
      return WearableCategory.UPPER_BODY
    case Section.WEARABLES_BOTTOM:
      return WearableCategory.LOWER_BODY
    case Section.WEARABLES_SHOES:
      return WearableCategory.FEET
    case Section.WEARABLES_EYEWEAR:
      return WearableCategory.EYEWEAR
    case Section.WEARABLES_EARRING:
      return WearableCategory.EARRING
    case Section.WEARABLES_MASK:
      return WearableCategory.MASK
    case Section.WEARABLES_HAT:
      return WearableCategory.HAT
    case Section.WEARABLES_HELMET:
      return WearableCategory.HELMET
  }
}
