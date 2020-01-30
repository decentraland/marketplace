import { all } from 'redux-saga/effects'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'

import { translationSaga } from './translation/sagas'
import { orderSaga } from './order/sagas'
import { accountSaga } from './account/sagas'
import { authorizationSaga } from './authorization/sagas'
import { nftSaga } from './nft/sagas'
import { uiSaga } from './ui/sagas'
import { tileSaga } from './tile/sagas'
import { walletSaga } from './wallet/sagas'

export function* rootSaga() {
  yield all([
    translationSaga(),
    transactionSaga(),
    orderSaga(),
    accountSaga(),
    authorizationSaga(),
    nftSaga(),
    uiSaga(),
    tileSaga(),
    walletSaga()
  ])
}
