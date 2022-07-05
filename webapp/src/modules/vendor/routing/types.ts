import * as decentraland from '../decentraland/routing/types'

export type Sections = typeof Sections

export type Section = decentraland.Section

// eslint-disable-next-line @typescript-eslint/no-redeclare -- Intentionally naming the variable the same as the type
export const Sections = {
  decentraland: { ...decentraland.Section }
} as const
