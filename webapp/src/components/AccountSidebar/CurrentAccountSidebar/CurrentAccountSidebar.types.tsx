import { VendorName } from '../../../modules/vendor'

export type Props = {
  section: string
  onBrowse: (vendor: VendorName, section: string) => void
  isRentalsEnabled: boolean
}
