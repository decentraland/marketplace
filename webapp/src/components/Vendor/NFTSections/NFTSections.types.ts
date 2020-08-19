import { Vendors } from '../../../modules/vendor/types'
import { Section } from '../../../modules/vendor/routing/types'

export type Props = {
  vendor: Vendors
  address?: string
  section?: Section
  onSectionClick: (section: Section) => void
}
