import * as decentraland from '../decentraland'
import * as superRare from '../super_rare'
import { Vendors } from '../types'

export type Section = decentraland.Section | superRare.Section
export const Section = {
  [Vendors.DECENTRALAND]: { ...decentraland.Section },
  [Vendors.SUPER_RARE]: { ...superRare.Section }
} as const
