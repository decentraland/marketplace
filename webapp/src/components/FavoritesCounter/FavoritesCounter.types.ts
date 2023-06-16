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
  isV1ListsEnabled: boolean
  isPickedByUser: boolean
  count: number
  isLoading: boolean
  onCounterClick: (item: Item) => ReturnType<typeof openModal>
  onV1PickClick: () => ReturnType<typeof openModal>
  onPick: typeof pickItemAsFavoriteRequest
  onUnpick: typeof unpickItemAsFavoriteRequest
}

export type MapStateProps = Pick<
  Props,
  'isPickedByUser' | 'isV1ListsEnabled' | 'count' | 'isLoading'
>

export type MapDispatchProps = Pick<
  Props,
  'onPick' | 'onUnpick' | 'onCounterClick' | 'onV1PickClick'
>
export type MapDispatch = Dispatch<
  | PickItemAsFavoriteRequestAction
  | UnpickItemAsFavoriteRequestAction
  | OpenModalAction
>

export type OwnProps = Pick<Props, 'item'>
