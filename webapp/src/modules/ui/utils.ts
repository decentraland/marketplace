import { Section, Sections } from '../vendor/routing/types'
import { View } from './types'

const accountViews = new Set<View>([View.ACCOUNT, View.CURRENT_ACCOUNT])
const landSections = new Set<Section>([
  Sections.decentraland.LAND,
  Sections.decentraland.PARCELS,
  Sections.decentraland.ESTATES
])

export const isAccountView = (view: View) => accountViews.has(view)
export const isLandSection = (section?: Section) =>
  !!section && landSections.has(section)
