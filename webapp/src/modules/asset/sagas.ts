import { getLocation, push } from 'connected-react-router'
import { put, select, takeEvery } from 'redux-saga/effects'
import {
  SetPurchaseAction,
  SET_PURCHASE
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { isNFTPurchase } from 'decentraland-dapps/dist/modules/gateway/utils'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../routing/locations'
import { buyItemWithCardFailure } from '../item/actions'
import { executeOrderWithCardFailure } from '../order/actions'
import { AssetType } from './types'

export function* assetSaga() {
  yield takeEvery(SET_PURCHASE, handleSetAssetPurchaseWithCard)
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

    if (status === PurchaseStatus.FAILED) {
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
