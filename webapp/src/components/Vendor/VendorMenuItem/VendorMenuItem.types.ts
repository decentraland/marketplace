import { Section } from '../../../modules/routing/types'
import { Vendors } from '../../../modules/vendor/types'

export type Props = {
  vendor: Vendors
  section: Section
  sections: Section[]
  onClick: (value: Section) => void
}
