import { BulkPickUnpickRequestAction } from '../favorites/actions'

export type DispatchableFromToastActions = BulkPickUnpickRequestAction

export enum BulkPickUnpickMessageType {
  ADD = 'add',
  REMOVE = 'remove'
}

export enum BulkPickUnpickSuccessOrFailureType {
  SUCCESS = 'success',
  FAILURE = 'failure'
}
