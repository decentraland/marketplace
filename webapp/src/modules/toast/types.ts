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
