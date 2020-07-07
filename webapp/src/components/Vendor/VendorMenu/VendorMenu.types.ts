import { Section } from '../../../modules/routing/types'
import { Vendors } from '../../../modules/vendor/types'

export type Props = {
  count?: number
  currentVendor: Vendors
  address?: string
  vendor: Vendors
  section: Section
  onClick: (value: Section) => void
}

export type MapStateProps = Pick<Props, 'count' | 'currentVendor'>
export type MapDispatchProps = {}
export type MapDispatch = {}
