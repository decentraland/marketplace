import * as decentraland from '../decentraland'
import * as superRare from '../super_rare'
import { Vendors } from '../types'

export type NFTsFetchFilters =
  | decentraland.NFTsFetchFilters
  | superRare.NFTsFetchFilters

export type NFTCategory = decentraland.NFTCategory | superRare.NFTCategory
export const NFTCategory = {
  [Vendors.DECENTRALAND]: { ...decentraland.NFTCategory },
  [Vendors.SUPER_RARE]: { ...superRare.NFTCategory }
} as const
