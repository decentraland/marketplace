import { Section } from '../../../modules/routing/search'
import { Vendors } from '../../../modules/vendor/types'

export type Props = {
  vendor: Vendors
  section: Section
  sections: Section[]
  onClick: (value: Section) => void
}
