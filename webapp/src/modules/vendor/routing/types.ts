import * as decentraland from '../decentraland'
import * as superRare from '../super_rare'
import * as makersPlace from '../makers_place'
import * as knownOrigin from '../known_origin'
import { VendorName } from '../types'

export type Section =
  | decentraland.Section
  | superRare.Section
  | makersPlace.Section
  | knownOrigin.Section

export const Section = {
  [VendorName.DECENTRALAND]: { ...decentraland.Section },
  [VendorName.SUPER_RARE]: { ...superRare.Section },
  [VendorName.MAKERS_PLACE]: { ...makersPlace.Section },
  [VendorName.KNOWN_ORIGIN]: { ...knownOrigin.Section }
} as const
