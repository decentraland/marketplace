import { getLocation, push } from 'connected-react-router'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  SetPurchaseAction,
  SET_PURCHASE
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { isNFTPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../routing/locations'
import { FETCH_ITEM_SUCCESS, buyItemWithCardFailure } from '../item/actions'
import { executeOrderWithCardFailure } from '../order/actions'
import { AssetType } from './types'
import { FETCH_NFT_SUCCESS } from '../nft/actions'
import { getSmartWearableRequiredPermissions } from '../../lib/asset'
import {
  FetchSmartWearableRequiredPermissionsRequestAction,
  fetchSmartWearableRequiredPermissionsFailure,
  fetchSmartWearableRequiredPermissionsSuccess
} from './actions'
import { isErrorWithMessage } from '../../lib/error'

export const failStatuses = [
  PurchaseStatus.CANCELLED,
  PurchaseStatus.FAILED,
  PurchaseStatus.REFUNDED
]

export function* assetSaga() {
  yield takeEvery(SET_PURCHASE, handleSetAssetPurchaseWithCard)
  yield takeEvery(
    [FETCH_ITEM_SUCCESS, FETCH_NFT_SUCCESS],
    handleFetchAssetSuccess
  )
}

function* handleSetAssetPurchaseWithCard(action: SetPurchaseAction) {
  const { purchase } = action.payload
  if (isNFTPurchase(purchase)) {
    const { nft, status } = purchase
    const { pathname }: ReturnType<typeof getLocation> = yield select(
      getLocation
    )

    const { tradeType, contractAddress, tokenId, itemId } = nft
    const assetType: AssetType =
      tradeType === TradeType.PRIMARY ? AssetType.ITEM : AssetType.NFT
    const assetId = tradeType === TradeType.PRIMARY ? itemId : tokenId
    const buyWithCardPathname = locations.buyWithCard(
      assetType,
      contractAddress,
      assetId
    )
    const statusPagePathname = locations.buyStatusPage(
      assetType,
      contractAddress,
      assetId
    )
    const shouldRedirect = [
      new URL(`${window.origin}${buyWithCardPathname}`).pathname,
      statusPagePathname
    ].includes(pathname)

    if (
      shouldRedirect &&
      [PurchaseStatus.PENDING, PurchaseStatus.COMPLETE].includes(status)
    ) {
      yield put(push(statusPagePathname))
    }

    if (failStatuses.includes(status)) {
      const failureAction =
        assetType === AssetType.NFT
          ? executeOrderWithCardFailure
          : buyItemWithCardFailure

      if (shouldRedirect) yield put(push(buyWithCardPathname))

      // TODO (buy nfts with card): is there a way to get the reason of the failure?
      yield put(failureAction(t('global.unknown_error')))
    }
  }
}

function* handleFetchAssetSuccess(
  action: FetchSmartWearableRequiredPermissionsRequestAction
) {
  try {
    const {
      urn,
      data: { wearable }
    } = action.payload.asset

    if (wearable?.isSmart && urn) {
      const requiredPermissions: string[] = yield call(
        getSmartWearableRequiredPermissions,
        urn
      )

      yield put(
        fetchSmartWearableRequiredPermissionsSuccess(requiredPermissions)
      )
    }
  } catch (error) {
    yield put(
      fetchSmartWearableRequiredPermissionsFailure(
        action.payload.asset,
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}
