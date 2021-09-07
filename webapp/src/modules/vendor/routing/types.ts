import * as decentraland from '../decentraland/routing/types'
import * as superRare from '../super_rare/routing/types'
import * as makersPlace from '../makers_place/routing/types'
import * as knownOrigin from '../known_origin/routing/types'

export type Sections = typeof Sections

export type Section =
  | decentraland.Section
  | superRare.Section
  | makersPlace.Section
  | knownOrigin.Section

// eslint-disable-next-line @typescript-eslint/no-redeclare -- Intentionally naming the variable the same as the type
export const Sections = {
  decentraland: { ...decentraland.Section },
  super_rare: { ...superRare.Section },
  makers_place: { ...makersPlace.Section },
  known_origin: { ...knownOrigin.Section }
} as const
