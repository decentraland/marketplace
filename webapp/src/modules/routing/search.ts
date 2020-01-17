import { Order, OrderCategory } from '../order/types'

export enum SearchSection {
  ALL = 'all',
  LAND = 'land',
  PARCELS = 'parcels',
  ESTATES = 'estates',
  WEARABLES = 'wearables'
}

export enum SearchSortBy {
  NEWEST = 'newest',
  CHEAPEST = 'cheapest'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type SearchOptions = {
  page?: number | null
  section?: SearchSection | null
  sortBy?: SearchSortBy | null
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

export function getSearchFilters(sortBy: SearchSortBy, section: SearchSection) {
  let orderBy: keyof Order = 'createdAt'
  let orderDirection: SortDirection = SortDirection.DESC
  let category: OrderCategory | undefined
  switch (sortBy) {
    case SearchSortBy.NEWEST: {
      orderBy = 'createdAt'
      orderDirection = SortDirection.DESC
      break
    }
    case SearchSortBy.CHEAPEST: {
      orderBy = 'price'
      orderDirection = SortDirection.ASC
      break
    }
  }
  switch (section) {
    case SearchSection.PARCELS: {
      category = OrderCategory.PARCEL
      break
    }
    case SearchSection.ESTATES: {
      category = OrderCategory.ESTATE
      break
    }
    case SearchSection.WEARABLES: {
      category = OrderCategory.WEARABLE
      break
    }
  }

  return [orderBy, orderDirection, category] as const
}
