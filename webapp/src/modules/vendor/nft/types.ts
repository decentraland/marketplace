import { Vendors } from '../types'

import * as decentraland from '../decentraland'
import * as superRare from '../super_rare'
import * as makersPlace from '../makers_place'
import * as knownOrigin from '../known_origin'

export type NFTsFetchFilters<
  V extends Vendors | unknown = unknown
> = V extends Vendors.DECENTRALAND
  ? decentraland.NFTsFetchFilters
  : V extends Vendors.SUPER_RARE
  ? superRare.NFTsFetchFilters
  : V extends Vendors.MAKERS_PLACE
  ? makersPlace.NFTsFetchFilters
  : V extends Vendors.KNOWN_ORIGIN
  ? knownOrigin.NFTsFetchFilters
  : V extends unknown
  ?
      | decentraland.NFTsFetchFilters
      | superRare.NFTsFetchFilters
      | makersPlace.NFTsFetchFilters
      | knownOrigin.NFTsFetchFilters
  : never
