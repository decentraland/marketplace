import { Dispatch } from 'redux'

import { View } from '../../modules/ui/types'
import { Vendors } from '../../modules/vendor/types'
import { browse, BrowseAction } from '../../modules/routing/actions'

export type Props = {
  vendor: Vendors
  view: View
  address?: string
  onlyOnSale?: boolean
  defaultOnlyOnSale: boolean
  onBrowse: typeof browse
}

export type MapStateProps = Pick<Props, 'onlyOnSale'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
export type OwnProps = Pick<Props, 'vendor' | 'address' | 'defaultOnlyOnSale'>
