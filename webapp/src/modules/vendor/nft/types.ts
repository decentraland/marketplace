import * as decentraland from '../decentraland'
import * as superRare from '../super_rare'
import * as makersPlace from '../makers_place'
import { Vendors } from '../types'

export type NFTsFetchFilters =
  | decentraland.NFTsFetchFilters
  | superRare.NFTsFetchFilters
  | makersPlace.NFTsFetchFilters

export type NFTCategory =
  | decentraland.NFTCategory
  | superRare.NFTCategory
  | makersPlace.NFTCategory

export const NFTCategory = {
  [Vendors.DECENTRALAND]: { ...decentraland.NFTCategory },
  [Vendors.SUPER_RARE]: { ...superRare.NFTCategory },
  [Vendors.MAKERS_PLACE]: { ...makersPlace.NFTCategory }
} as const
