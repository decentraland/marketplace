import { RootState } from '../../reducer'

export const getState = (state: RootState) => state.ui.preview
export const getIsTryingOn = (state: RootState) => getState(state).isTryingOn
export const getIsPlayingEmote = (state: RootState) => getState(state).isPlayingEmote
export const getWearablePreviewController = (state: RootState) => getState(state).wearablePreviewController
export const getUnityPreloaderIsReady = (state: RootState) => getState(state).unityPreloader.isReady
export const getUnityPreloaderIsLoading = (state: RootState) => getState(state).unityPreloader.isLoading
