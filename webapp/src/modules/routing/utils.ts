import { BrowseOptions, SortBy } from './types'
import { Section } from '../vendor/decentraland'
import { getPersistedIsMapProperty, isAccountView, isLandSection } from '../ui/utils'
import { omit, reset } from '../../lib/utils'
import { View } from '../ui/types'
import { getSearchParams } from './search'

export const rentalFilters = [
  SortBy.NAME,
  SortBy.NEWEST,
  SortBy.RENTAL_DATE,
  SortBy.RENTAL_LISTING_DATE,
  SortBy.MAX_RENTAL_PRICE,
  SortBy.MIN_RENTAL_PRICE
]
export const sellFilters = [
  SortBy.NAME,
  SortBy.CHEAPEST,
  SortBy.NEWEST,
  SortBy.RECENTLY_REVIEWED,
  SortBy.RECENTLY_SOLD,
  SortBy.RECENTLY_LISTED,
  SortBy.SIZE
]
export const COLLECTIONS_PER_PAGE = 6
export const SALES_PER_PAGE = 6

export function buildBrowseURL(
  pathname: string,
  browseOptions: BrowseOptions
): string {
  let params: URLSearchParams | undefined
  if (browseOptions.section === Section.ON_SALE) {
    params = getSearchParams({ section: Section.ON_SALE })
  } else {
    params = getSearchParams(browseOptions)
  }

  return params ? `${pathname}?${params.toString()}` : pathname
}

export function isMapSet(
  isMap: boolean | undefined,
  section: Section,
  view: View | undefined
): boolean {
  const isMapPropertyPersisted = getPersistedIsMapProperty()

  return (
    isMap ??
    (section === Section.LAND &&
    (view === undefined || (view && !isAccountView(view))) &&
    isMapPropertyPersisted !== null
      ? isMapPropertyPersisted!
      : false)
  )
}

export function getClearedBrowseOptions(browseOptions: BrowseOptions, fillWithUndefined = false): BrowseOptions {
  const keys = [
    'rarities',
    'wearableGenders',
    'network',
    'contracts',
    'emotePlayMode',
    'page',
    'minPrice',
    'maxPrice',
    'onlySmart',
    'search',
    'onlyOnRent',
    'onlyOnSale'
  ]

  const clearedBrowseOptions = fillWithUndefined ? reset(browseOptions, keys) : omit(browseOptions, keys)

  // The onlyOnSale filter is ON by default. The clear should remove it if it's off so it's back on (default state)
  if (
    !clearedBrowseOptions.onlyOnSale &&
    !isLandSection(browseOptions.section as Section)
  ) {
    clearedBrowseOptions.onlyOnSale = true
  }
  // reset the pages to the first one
  clearedBrowseOptions.page = 1
  return clearedBrowseOptions;
}
