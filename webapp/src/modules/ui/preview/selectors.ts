import { RootState } from '../../reducer'

export const getState = (state: RootState) => state.ui.preview
export const getIsTryingOn = (state: RootState) => getState(state).isTryingOn
