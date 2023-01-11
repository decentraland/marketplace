import { Section } from '../../../../modules/vendor/decentraland/routing/types'

export type Props = {
  section: Section
  sections: Section[]
  onMenuItemClick: (section: Section) => void
}
