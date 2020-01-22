import { NFTCategory } from '../nft/types'

export enum Section {
  ALL = 'all',
  LAND = 'land',
  PARCELS = 'parcels',
  ESTATES = 'estates',
  WEARABLES = 'wearables'
}

export enum SortBy {
  NEWEST = 'newest',
  CHEAPEST = 'cheapest'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type SearchOptions = {
  page?: number | null
  section?: Section | null
  sortBy?: SortBy | null
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
  }
  return params
}

// @nico TODO: Maybe this isn't the best name for it? there's a bit of a mixup between categories and sections
// @nico TODO: We need to support the LAND section, which comprises PARCELS and ESTATES. Might need backend work
export function getSearchCategory(section: Section) {
  let category: NFTCategory | undefined
  switch (section) {
    case Section.PARCELS: {
      category = NFTCategory.PARCEL
      break
    }
    case Section.ESTATES: {
      category = NFTCategory.ESTATE
      break
    }
    case Section.WEARABLES: {
      category = NFTCategory.WEARABLE
      break
    }
  }
  return category
}
