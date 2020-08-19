import * as decentraland from '../decentraland'
import * as superRare from '../super_rare'
import * as makersPlace from '../makers_place'
import * as knownOrigin from '../known_origin'
import { Vendors } from '../types'

export type Section =
  | decentraland.Section
  | superRare.Section
  | makersPlace.Section
  | knownOrigin.Section

export const Section = {
  [Vendors.DECENTRALAND]: { ...decentraland.Section },
  [Vendors.SUPER_RARE]: { ...superRare.Section },
  [Vendors.MAKERS_PLACE]: { ...makersPlace.Section },
  [Vendors.KNOWN_ORIGIN]: { ...knownOrigin.Section }
} as const
