import { BrowseOptions } from './types'
import { Section } from '../vendor/decentraland'
import { getSearchParams } from './search'

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
