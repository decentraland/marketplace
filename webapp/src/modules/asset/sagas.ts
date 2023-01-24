import { push } from 'connected-react-router'
import {
  SetPurchaseAction,
  SET_PURCHASE
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { put, takeEvery } from 'redux-saga/effects'
import { locations } from '../routing/locations'
import { AssetType } from './types'

export function* assetSaga() {
  yield takeEvery(SET_PURCHASE, handleSetAssetPurchaseWithCard)
}

function* handleSetAssetPurchaseWithCard(action: SetPurchaseAction) {
  const { nft } = action.payload.purchase
  if (nft) {
    const { tradeType, contractAddress, tokenId } = nft
    yield put(
      push(
        locations.buyStatusPage(
          tradeType === TradeType.PRIMARY ? AssetType.ITEM : AssetType.NFT,
          contractAddress,
          tokenId
        )
      )
    )
  }
}
