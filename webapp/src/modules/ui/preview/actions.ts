import { action } from 'typesafe-actions'

export const SET_IS_TRYING_ON = 'Set is trying on'
export const setIsTryingOn = (value: boolean) =>
  action(SET_IS_TRYING_ON, { value })
export type SetIsTryingOnAction = ReturnType<typeof setIsTryingOn>
