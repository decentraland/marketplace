import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  section?: string
  onSectionClick: (section: string) => void
}
