import * as decentraland from '../decentraland'
import * as superRare from '../super_rare'
import * as makersPlace from '../makers_place'
import { Vendors } from '../types'

export type Section =
  | decentraland.Section
  | superRare.Section
  | makersPlace.Section

export const Section = {
  [Vendors.DECENTRALAND]: { ...decentraland.Section },
  [Vendors.SUPER_RARE]: { ...superRare.Section },
  [Vendors.MAKERS_PLACE]: { ...makersPlace.Section }
} as const
