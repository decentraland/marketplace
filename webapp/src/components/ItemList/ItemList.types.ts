import { Item } from '@dcl/schemas'
import { Dispatch } from 'redux'

import { browseItems, BrowseItemsAction } from '../../modules/routing/actions'

export type Props = {
  items: Item[]
  page: number
  count?: number
  isLoading: boolean
  onBrowse: typeof browseItems
}

export type MapStateProps = Pick<
  Props,
  'items' | 'page' | 'count' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseItemsAction>
