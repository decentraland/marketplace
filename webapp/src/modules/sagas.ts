import { all } from 'redux-saga/effects'
import { createAnalyticsSaga } from 'decentraland-dapps/dist/modules/analytics/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'

import { translationSaga } from './translation/sagas'
import { orderSaga } from './order/sagas'
import { bidSaga } from './bid/sagas'
import { authorizationSaga } from './authorization/sagas'
import { nftSaga } from './nft/sagas'
import { uiSaga } from './ui/sagas'
import { tileSaga } from './tile/sagas'
import { walletSaga } from './wallet/sagas'
import { proxmitySaga } from './proximity/sagas'

const analyticsSaga = createAnalyticsSaga()

export function* rootSaga() {
  yield all([
    analyticsSaga(),
    translationSaga(),
    transactionSaga(),
    orderSaga(),
    authorizationSaga(),
    nftSaga(),
    uiSaga(),
    tileSaga(),
    walletSaga(),
    proxmitySaga(),
    bidSaga()
  ])
}
