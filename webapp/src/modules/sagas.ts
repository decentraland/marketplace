import { all } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'

import { translationSaga } from './translation/sagas'
import { orderSaga } from './order/sagas'
import { accountSaga } from './account/sagas'
import { nftSaga } from './nft/sagas'
import { uiSaga } from './ui/sagas'
import { tileSaga } from './tile/sagas'

import { MANA_ADDRESS } from './contracts'

const walletSaga = createWalletSaga({ MANA_ADDRESS })

export function* rootSaga() {
  yield all([
    walletSaga(),
    translationSaga(),
    transactionSaga(),
    orderSaga(),
    accountSaga(),
    nftSaga(),
    uiSaga(),
    tileSaga()
  ])
}
