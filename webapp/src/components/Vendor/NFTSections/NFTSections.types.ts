import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  address?: string
  section?: string
  onSectionClick: (section: string) => void
}
