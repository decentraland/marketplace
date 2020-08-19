import { Section } from '../../../../modules/vendor/known_origin/routing/types'

export type Props = {
  section?: Section
  address?: string
  onSectionClick: (section: Section) => void
}
