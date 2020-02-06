import { Section } from '../../../modules/routing/search'

export type Props = {
  section: Section
  currentSection: Section
  isSub?: boolean
  withCaret?: boolean
  onNavigate: any
}
