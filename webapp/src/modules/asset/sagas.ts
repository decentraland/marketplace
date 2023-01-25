import { getLocation, push } from 'connected-react-router'
import {
  SetPurchaseAction,
  SET_PURCHASE
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { isManaPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { put, select, takeEvery } from 'redux-saga/effects'
import { locations } from '../routing/locations'
import { AssetType } from './types'

export function* assetSaga() {
  yield takeEvery(SET_PURCHASE, handleSetAssetPurchaseWithCard)
}

function* handleSetAssetPurchaseWithCard(action: SetPurchaseAction) {
  const { purchase } = action.payload
  if (!isManaPurchase(purchase)) {
    const { nft, status } = purchase
    const { pathname }: ReturnType<typeof getLocation> = yield select(
      getLocation
    )

    const { tradeType, contractAddress, tokenId } = nft
    const assetType: AssetType =
      tradeType === TradeType.PRIMARY ? AssetType.ITEM : AssetType.NFT
    const statusPagePathname = locations.buyStatusPage(
      assetType,
      contractAddress,
      tokenId
    )
    const shouldRedirect = [
      new URL(
        `${window.origin}${locations.buyWithCard(
          assetType,
          contractAddress,
          tokenId
        )}`
      ).pathname,
      statusPagePathname
    ].includes(pathname)

    if (
      shouldRedirect &&
      [PurchaseStatus.PENDING, PurchaseStatus.COMPLETE].includes(status)
    ) {
      yield put(push(statusPagePathname))
    }
  }
}
