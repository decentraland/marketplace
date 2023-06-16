import {
  BulkPickUnpickRequestAction,
  PickItemAsFavoriteRequestAction,
  UndoUnpickingItemAsFavoriteRequestAction,
  UnpickItemAsFavoriteRequestAction
} from '../favorites/actions'

export type DispatchableFromToastActions =
  | PickItemAsFavoriteRequestAction
  | UnpickItemAsFavoriteRequestAction
  | UndoUnpickingItemAsFavoriteRequestAction
  | BulkPickUnpickRequestAction

export enum BulkPickUnpickMessageType {
  ADD = 'add',
  REMOVE = 'remove'
}

export enum BulkPickUnpickSuccessOrFailureType {
  SUCCESS = 'success',
  FAILURE = 'failure'
}
