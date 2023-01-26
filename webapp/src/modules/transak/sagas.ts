import { put, select, takeEvery } from 'redux-saga/effects'
import { Network } from '@dcl/schemas'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Transak } from 'decentraland-dapps/dist/modules/gateway/transak'
import {
  ProductsAvailed,
  TradeType
} from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { TransakConfig } from 'decentraland-dapps/dist/modules/gateway/types'
import { closeAllModals } from '../modal/actions'
import { config } from '../../config'
import { isNFT } from '../asset/utils'
import { OPEN_TRANSAK, OpenTransakAction } from './actions'

export function* transakSaga() {
  yield takeEvery(OPEN_TRANSAK, handleOpenTransak)
}

function* handleOpenTransak(action: OpenTransakAction) {
  const { asset } = action.payload
  const transakConfig: TransakConfig = {
    key: config.get('TRANSAK_KEY'),
    env: config.get('TRANSAK_ENV')
  }
  const customizationOptions = {
    contractAddress: asset.contractAddress,
    tradeType: isNFT(asset) ? TradeType.SECONDARY : TradeType.PRIMARY,
    tokenId: isNFT(asset) ? asset.tokenId : asset.itemId,
    productsAvailed: ProductsAvailed.BUY,
    isNFT: true
  }

  const address: string = yield select(getAddress)

  yield put(closeAllModals())

  new Transak(transakConfig, customizationOptions).openWidget(
    address,
    Network.MATIC
  )
}
