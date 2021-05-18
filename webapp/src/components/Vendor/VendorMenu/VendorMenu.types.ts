import { Section } from '../../../modules/routing/types'
import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  count?: number
  currentVendor: VendorName
  address?: string
  vendor: VendorName
  section: Section
  onClick: (value: Section) => void
}

export type MapStateProps = Pick<Props, 'count' | 'currentVendor'>
export type MapDispatchProps = {}
export type MapDispatch = {}
