import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import {
  openModal,
  OpenModalAction
} from 'decentraland-dapps/dist/modules/modal/actions'
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
  isLoading: boolean
  onCounterClick: (item: Item) => ReturnType<typeof openModal>
  onPick: typeof pickItemAsFavoriteRequest
  onUnpick: typeof unpickItemAsFavoriteRequest
}

export type MapStateProps = Pick<
  Props,
  'isPickedByUser' | 'count' | 'isLoading'
>

export type MapDispatchProps = Pick<
  Props,
  'onPick' | 'onUnpick' | 'onCounterClick'
>
export type MapDispatch = Dispatch<
  | PickItemAsFavoriteRequestAction
  | UnpickItemAsFavoriteRequestAction
  | OpenModalAction
>

export type OwnProps = Pick<Props, 'item'>
