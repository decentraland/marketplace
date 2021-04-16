import { Vendors } from './types'

export const MAX_QUERY_SIZE = 1000
export const MAX_PAGE = 10000
export const PAGE_SIZE = 24

export function getMaxQuerySize(vendor: Vendors) {
  switch (vendor) {
    case Vendors.DECENTRALAND:
      return MAX_QUERY_SIZE
    case Vendors.SUPER_RARE:
      return MAX_QUERY_SIZE
    case Vendors.MAKERS_PLACE:
      return MAX_QUERY_SIZE
    case Vendors.KNOWN_ORIGIN:
      return MAX_QUERY_SIZE
  }
}
