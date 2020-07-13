import { action } from 'typesafe-actions'

import { View } from './types'

// Set View

export const SET_VIEW = 'Set View'

export const setView = (view: View) => action(SET_VIEW, { view })

export type SetViewAction = ReturnType<typeof setView>
