import { takeEvery, put, select, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { IPreviewController, PreviewEmoteEventType } from '@dcl/schemas'
import {
  CONNECT_WALLET_SUCCESS,
  ConnectWalletSuccessAction
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { push, getLocation } from 'connected-react-router'
import { locations } from '../routing/locations'
import {
  setEmotePlaying,
  SetWearablePreviewControllerAction,
  SET_WEARABLE_PREVIEW_CONTROLLER
} from './preview/actions'

export function* uiSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeEvery(
    SET_WEARABLE_PREVIEW_CONTROLLER,
    handleSetWearablePreviewController
  )
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
    const eventEmit = (type: string) => {
      emit(type)
    }

    const handleEvent = (type: string) => {
      return controller.emote.events.on(type, () => eventEmit(type))
    }

    handleEvent(PreviewEmoteEventType.ANIMATION_PLAY)
    handleEvent(PreviewEmoteEventType.ANIMATION_PAUSE)
    handleEvent(PreviewEmoteEventType.ANIMATION_END)

    const unsubscribe = () => {
      controller.emote.events.off(
        PreviewEmoteEventType.ANIMATION_PLAY,
        eventEmit
      )
      controller.emote.events.off(
        PreviewEmoteEventType.ANIMATION_PAUSE,
        eventEmit
      )
      controller.emote.events.off(
        PreviewEmoteEventType.ANIMATION_END,
        eventEmit
      )
    }

    return unsubscribe
  })
}

function* handleSetWearablePreviewController(
  action: SetWearablePreviewControllerAction
) {
  const controller: IPreviewController | null = action.payload.controller

  if (controller) {
    const emotesChannel = createWearablePreviewChannel(controller)

    try {
      while (true) {
        try {
          const event: string = yield take(emotesChannel)
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
