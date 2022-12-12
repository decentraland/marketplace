import { BrowseOptions, SortBy } from './types'
import { Section } from '../vendor/decentraland'
import { getPersistedIsMapProperty } from '../ui/utils'
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
  section: Section
): boolean {
  const isMapPropertyPersisted = getPersistedIsMapProperty()

  return (
    isMap ??
    (section === Section.LAND && isMapPropertyPersisted !== null
      ? isMapPropertyPersisted!
      : false)
  )
}
