import { Contract } from '../../../modules/vendor/services'
import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  contracts: Contract[]
  count?: number
  currentVendor: VendorName
  address?: string
  vendor: VendorName
  section: string
  onClick: (value: string) => void
}

export type MapStateProps = Pick<Props, 'contracts' | 'count' | 'currentVendor'>
