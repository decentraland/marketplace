import { Section } from '../../../../modules/vendor/known_origin/routing/types'

export type Props = {
  section?: Section
  onSectionClick: (section: Section) => void
}
