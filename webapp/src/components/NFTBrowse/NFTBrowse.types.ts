import { Dispatch } from 'redux'

import { View } from '../../modules/ui/types'
import { Vendors, Section } from '../../modules/vendor/types'
import { SortBy } from '../../modules/routing/types'
import { browse, BrowseAction } from '../../modules/routing/actions'

export type Props = {
  isLoadMore: boolean
  page: number
  section: Section
  sortBy: SortBy
  search: string
  onlyOnSale?: boolean
  vendor: Vendors
  view: View
  address?: string
  defaultOnlyOnSale: boolean
  onBrowse: typeof browse
}

export type MapStateProps = Pick<
  Props,
  'isLoadMore' | 'page' | 'section' | 'sortBy' | 'search' | 'onlyOnSale'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
export type OwnProps = Pick<Props, 'vendor' | 'address' | 'defaultOnlyOnSale'>
