import { all } from 'redux-saga/effects'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'

import { translationSaga } from './translation/sagas'
import { orderSaga } from './order/sagas'
import { authorizationSaga } from './authorization/sagas'
import { nftSaga } from './nft/sagas'
import { uiSaga } from './ui/sagas'
import { tileSaga } from './tile/sagas'
import { walletSaga } from './wallet/sagas'
import { proxmitySaga } from './proximity/sagas'

export function* rootSaga() {
  yield all([
    translationSaga(),
    transactionSaga(),
    orderSaga(),
    authorizationSaga(),
    nftSaga(),
    uiSaga(),
    tileSaga(),
    walletSaga(),
    proxmitySaga()
  ])
}
