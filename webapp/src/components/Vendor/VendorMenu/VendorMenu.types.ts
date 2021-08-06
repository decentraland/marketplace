import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  count?: number
  currentVendor: VendorName
  address?: string
  vendor: VendorName
  section: string
  onClick: (value: string) => void
}

export type MapStateProps = Pick<Props, 'count' | 'currentVendor'>
export type MapDispatchProps = {}
export type MapDispatch = {}
