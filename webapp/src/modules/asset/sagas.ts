import { getLocation, push } from 'connected-react-router'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { SetPurchaseAction, SET_PURCHASE } from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { isNFTPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getSmartWearableRequiredPermissions, getSmartWearableVideoShowcase } from '../../lib/asset'
import { isErrorWithMessage } from '../../lib/error'
import { buyItemWithCardFailure } from '../item/actions'
import { executeOrderWithCardFailure } from '../order/actions'
import { locations } from '../routing/locations'
import {
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST,
  FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST,
  FetchSmartWearableRequiredPermissionsRequestAction,
  FetchSmartWearableVideoHashRequestAction,
  fetchSmartWearableRequiredPermissionsFailure,
  fetchSmartWearableRequiredPermissionsSuccess,
  fetchSmartWearableVideoHashFailure,
  fetchSmartWearableVideoHashSuccess
} from './actions'
import { AssetType } from './types'

export const failStatuses = [PurchaseStatus.CANCELLED, PurchaseStatus.FAILED, PurchaseStatus.REFUNDED]

export function* assetSaga() {
  yield takeEvery(SET_PURCHASE, handleSetAssetPurchaseWithCard)
  yield takeEvery(FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST, handleFetchSmartWearableRequiredPermissionsRequest)
  yield takeEvery(FETCH_SMART_WEARABLE_VIDEO_HASH_REQUEST, handleFetchSmartWearableVideoHashRequest)
}

function* handleSetAssetPurchaseWithCard(action: SetPurchaseAction) {
  const { purchase } = action.payload
  if (isNFTPurchase(purchase)) {
    const { nft, status } = purchase
    const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)

    const { tradeType, contractAddress, tokenId, itemId } = nft
    const assetType: AssetType = tradeType === TradeType.PRIMARY ? AssetType.ITEM : AssetType.NFT
    const assetId = tradeType === TradeType.PRIMARY ? itemId : tokenId
    const buyWithCardPathname = locations.buyWithCard(assetType, contractAddress, assetId)
    const statusPagePathname = locations.buyStatusPage(assetType, contractAddress, assetId)
    const shouldRedirect = [new URL(`${window.origin}${buyWithCardPathname}`).pathname, statusPagePathname].includes(pathname)

    if (shouldRedirect && [PurchaseStatus.PENDING, PurchaseStatus.COMPLETE].includes(status)) {
      yield put(push(statusPagePathname))
    }

    if (failStatuses.includes(status)) {
      const failureAction = assetType === AssetType.NFT ? executeOrderWithCardFailure : buyItemWithCardFailure

      if (shouldRedirect) yield put(push(buyWithCardPathname))

      // TODO (buy nfts with card): is there a way to get the reason of the failure?
      yield put(failureAction(t('global.unknown_error')))
    }
  }
}

function* handleFetchSmartWearableRequiredPermissionsRequest(action: FetchSmartWearableRequiredPermissionsRequestAction) {
  const { asset } = action.payload
  let requiredPermissions: string[] = []

  try {
    const {
      urn,
      data: { wearable }
    } = asset

    if (wearable?.isSmart && urn) {
      requiredPermissions = yield call(getSmartWearableRequiredPermissions, urn)
    }

    yield put(fetchSmartWearableRequiredPermissionsSuccess(asset, requiredPermissions))
  } catch (error) {
    yield put(fetchSmartWearableRequiredPermissionsFailure(asset, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

function* handleFetchSmartWearableVideoHashRequest(action: FetchSmartWearableVideoHashRequestAction) {
  const { asset } = action.payload
  let videoHash: string | undefined

  try {
    const {
      urn,
      data: { wearable }
    } = asset

    if (wearable?.isSmart && urn) {
      videoHash = yield call(getSmartWearableVideoShowcase, asset)
    }

    yield put(fetchSmartWearableVideoHashSuccess(asset, videoHash))
  } catch (error) {
    yield put(fetchSmartWearableVideoHashFailure(asset, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}
