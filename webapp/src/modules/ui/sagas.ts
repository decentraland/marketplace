import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router'
import { History } from 'history'
import { eventChannel } from 'redux-saga'
import { takeEvery, put, take, spawn, getContext, select, takeLatest } from 'redux-saga/effects'
import { IPreviewController, PreviewEmoteEventType } from '@dcl/schemas'
import { CONNECT_WALLET_SUCCESS, ConnectWalletSuccessAction } from 'decentraland-dapps/dist/modules/wallet/actions'
import { locations } from '../routing/locations'
import { ExtendedHistory } from '../types'
import { browseSaga } from './browse/sagas'
import {
  setEmotePlaying,
  SetWearablePreviewControllerAction,
  SET_WEARABLE_PREVIEW_CONTROLLER,
  setPortalPreviewProps
} from './preview/actions'
import { getPortalPreviewProps } from './preview/selectors'

export function* uiSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeEvery(SET_WEARABLE_PREVIEW_CONTROLLER, handleSetWearablePreviewController)
  yield takeLatest(LOCATION_CHANGE, handleLocationChangeForPortalPreview)
  yield spawn(browseSaga)
}

function* handleConnectWalletSuccess(_action: ConnectWalletSuccessAction) {
  const history: History = yield getContext('history')
  const location = history.location
  const { pathname, search } = location
  if (pathname === locations.signIn()) {
    const redirectTo = new URLSearchParams(search).get('redirectTo')
    if (redirectTo) {
      history.push(decodeURIComponent(redirectTo))
    } else {
      history.push(locations.defaultCurrentAccount())
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
          const event = (yield take(emotesChannel)) as PreviewEmoteEventType
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

function* handleLocationChangeForPortalPreview(action: LocationChangeAction) {
  const history: ExtendedHistory = yield getContext('history')
  const location = action.payload.location
  const prevLocation = history.getLastVisitedLocations(1)[0] || null

  // Only process if we have both locations and they're different
  if (!location || !prevLocation || location.pathname === prevLocation.pathname) {
    return
  }

  const currentPortalProps: ReturnType<typeof getPortalPreviewProps> = yield select(getPortalPreviewProps)
  const prevAssetParams = extractAssetParams(prevLocation.pathname)

  // Clear portal preview if we're leaving the same asset page that's currently previewed
  if (prevAssetParams && currentPortalProps && isSameAssetInPreview(prevAssetParams, currentPortalProps)) {
    yield put(setPortalPreviewProps({ contractAddress: '', itemId: '', tokenId: '' }))
  }
}

const isSameAssetInPreview = (
  assetParams: NonNullable<ReturnType<typeof extractAssetParams>>,
  portalProps: NonNullable<ReturnType<typeof getPortalPreviewProps>>
): boolean => {
  return (
    portalProps.contractAddress === assetParams.contractAddress &&
    (portalProps.itemId === assetParams.itemId || portalProps.tokenId === assetParams.tokenId)
  )
}

// Helper function to extract contract address and item/token ID from URL
const extractAssetParams = (pathname: string): { contractAddress?: string; itemId?: string; tokenId?: string } | null => {
  const pathParts = pathname.split('/')

  // Check if it's an item page: /contracts/{contractAddress}/items/{itemId}
  if (pathParts.includes('contracts') && pathParts.includes('items')) {
    const contractsIndex = pathParts.indexOf('contracts')
    const itemsIndex = pathParts.indexOf('items')

    if (contractsIndex !== -1 && itemsIndex !== -1 && itemsIndex > contractsIndex) {
      const contractAddress = pathParts[contractsIndex + 1]
      const itemId = pathParts[itemsIndex + 1]

      if (contractAddress && itemId && contractAddress !== ':contractAddress' && itemId !== ':itemId') {
        return { contractAddress, itemId }
      }
    }
  }

  // Check if it's an NFT page: /contracts/{contractAddress}/tokens/{tokenId}
  if (pathParts.includes('contracts') && pathParts.includes('tokens')) {
    const contractsIndex = pathParts.indexOf('contracts')
    const tokensIndex = pathParts.indexOf('tokens')

    if (contractsIndex !== -1 && tokensIndex !== -1 && tokensIndex > contractsIndex) {
      const contractAddress = pathParts[contractsIndex + 1]
      const tokenId = pathParts[tokensIndex + 1]

      if (contractAddress && tokenId && contractAddress !== ':contractAddress' && tokenId !== ':tokenId') {
        return { contractAddress, tokenId }
      }
    }
  }

  return null
}
