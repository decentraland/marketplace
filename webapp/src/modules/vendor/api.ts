import { MAX_QUERY_SIZE as decentralandMaxQuerySize } from './decentraland/api'
import { MAX_QUERY_SIZE as superRareMaxQuerySize } from './super_rare/api'
import { MAX_QUERY_SIZE as makersPlaceMaxQuerySize } from './makers_place/api'
import { Vendors } from './types'

export const MAX_PAGE = 10000
export const PAGE_SIZE = 24

export function getMaxQuerySize(vendor: Vendors) {
  switch (vendor) {
    case Vendors.DECENTRALAND:
      return decentralandMaxQuerySize
    case Vendors.SUPER_RARE:
      return superRareMaxQuerySize
    case Vendors.MAKERS_PLACE:
      return makersPlaceMaxQuerySize
  }
}
