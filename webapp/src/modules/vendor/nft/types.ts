import { VendorName } from '../types'

import * as decentraland from '../decentraland'
import * as superRare from '../super_rare'
import * as makersPlace from '../makers_place'
import * as knownOrigin from '../known_origin'

export type NFTsFetchFilters<
  V extends VendorName | unknown = unknown
> = V extends VendorName.DECENTRALAND
  ? decentraland.NFTsFetchFilters
  : V extends VendorName.SUPER_RARE
  ? superRare.NFTsFetchFilters
  : V extends VendorName.MAKERS_PLACE
  ? makersPlace.NFTsFetchFilters
  : V extends VendorName.KNOWN_ORIGIN
  ? knownOrigin.NFTsFetchFilters
  : V extends unknown
  ?
      | decentraland.NFTsFetchFilters
      | superRare.NFTsFetchFilters
      | makersPlace.NFTsFetchFilters
      | knownOrigin.NFTsFetchFilters
  : never
