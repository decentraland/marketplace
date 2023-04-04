import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import {
  pickItemAsFavoriteRequest,
  PickItemAsFavoriteRequestAction,
  unpickItemAsFavoriteRequest,
  UnpickItemAsFavoriteRequestAction
} from '../../modules/favorites/actions'

export type Props = {
  className?: string
  item: Item
  isCollapsed?: boolean
  isPickedByUser: boolean
  count: number
  onPick: typeof pickItemAsFavoriteRequest
  onUnpick: typeof unpickItemAsFavoriteRequest
}

export type MapStateProps = Pick<Props, 'isPickedByUser' | 'count'>

export type MapDispatchProps = Pick<Props, 'onPick' | 'onUnpick'>
export type MapDispatch = Dispatch<
  PickItemAsFavoriteRequestAction | UnpickItemAsFavoriteRequestAction
>

export type OwnProps = Pick<Props, 'item'>
