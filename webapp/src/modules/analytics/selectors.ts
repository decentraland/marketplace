import { RootState } from '../reducer'

export const getState = (state: RootState) => state.analytics
export const getVolumeData = (state: RootState) => getState(state).volumeData
export const getRankingsData = (state: RootState) => getState(state).rankingsData
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error
