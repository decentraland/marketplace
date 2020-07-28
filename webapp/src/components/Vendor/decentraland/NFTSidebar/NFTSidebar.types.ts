import { Section } from '../../../../modules/vendor/decentraland/routing/types'

export type Props = {
  section: Section
  onMenuItemClick: (section: Section) => void
}
