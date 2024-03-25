import { push, getLocation } from 'connected-react-router'
import { eventChannel } from 'redux-saga'
import { takeEvery, put, select, take, spawn } from 'redux-saga/effects'
import { IPreviewController, PreviewEmoteEventType } from '@dcl/schemas'
import { CONNECT_WALLET_SUCCESS, ConnectWalletSuccessAction } from 'decentraland-dapps/dist/modules/wallet/actions'
import { locations } from '../routing/locations'
import { browseSaga } from './browse/sagas'
import { setEmotePlaying, SetWearablePreviewControllerAction, SET_WEARABLE_PREVIEW_CONTROLLER } from './preview/actions'

export function* uiSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeEvery(SET_WEARABLE_PREVIEW_CONTROLLER, handleSetWearablePreviewController)
  yield spawn(browseSaga)
}

function* handleConnectWalletSuccess(_action: ConnectWalletSuccessAction) {
  const location: ReturnType<typeof getLocation> = yield select(getLocation)
  const { pathname, search } = location
  if (pathname === locations.signIn()) {
    const redirectTo = new URLSearchParams(search).get('redirectTo')
    if (redirectTo) {
      yield put(push(decodeURIComponent(redirectTo)))
    } else {
      yield put(push(locations.defaultCurrentAccount()))
    }
  }
}

function createWearablePreviewChannel(controller: IPreviewController) {
  return eventChannel(emit => {
    const handleAnimationPlay = () => emit(PreviewEmoteEventType.ANIMATION_PLAY)
    const handleAnimationPause = () => emit(PreviewEmoteEventType.ANIMATION_PAUSE)
    const handleAnimationEnd = () => emit(PreviewEmoteEventType.ANIMATION_END)
    controller.emote.events.on(PreviewEmoteEventType.ANIMATION_PLAY, handleAnimationPlay)
    controller.emote.events.on(PreviewEmoteEventType.ANIMATION_PAUSE, handleAnimationPause)
    controller.emote.events.on(PreviewEmoteEventType.ANIMATION_END, handleAnimationEnd)

    const unsubscribe = () => {
      controller.emote.events.off(PreviewEmoteEventType.ANIMATION_PLAY, handleAnimationPlay)
      controller.emote.events.off(PreviewEmoteEventType.ANIMATION_PAUSE, handleAnimationPause)
      controller.emote.events.off(PreviewEmoteEventType.ANIMATION_END, handleAnimationEnd)
    }

    return unsubscribe
  })
}

function* handleSetWearablePreviewController(action: SetWearablePreviewControllerAction) {
  const controller: IPreviewController | null = action.payload.controller

  if (controller) {
    const emotesChannel = createWearablePreviewChannel(controller)

    try {
      while (true) {
        try {
          const event: PreviewEmoteEventType = yield take(emotesChannel)
          switch (event) {
            case PreviewEmoteEventType.ANIMATION_PLAY:
              yield put(setEmotePlaying(true))
              break
            case PreviewEmoteEventType.ANIMATION_PAUSE:
              yield put(setEmotePlaying(false))
              break
            case PreviewEmoteEventType.ANIMATION_END:
              yield put(setEmotePlaying(false))
              break
          }
        } catch (error) {
          yield put(setEmotePlaying(false))
        }
      }
    } finally {
      emotesChannel.close()
    }
  }
}
