import * as decentraland from '../decentraland'
import * as superRare from '../super_rare'
import * as makersPlace from '../makers_place'
import * as knownOrigin from '../known_origin'

export type Section = typeof Section

// eslint-disable-next-line @typescript-eslint/no-redeclare -- Intentionally naming the variable the same as the type
export const Section = {
  decentraland: { ...decentraland.Section },
  super_rare: { ...superRare.Section },
  makers_place: { ...makersPlace.Section },
  known_origin: { ...knownOrigin.Section }
} as const
