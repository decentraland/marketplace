import { all } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'

import { translationSaga } from './translation/sagas'
import { orderSaga } from './order/sagas'
import { accountSaga } from './account/sagas'

const walletSaga = createWalletSaga({
  MANA_ADDRESS: process.env.REACT_APP_MANA_ADDRESS!
})

export function* rootSaga() {
  yield all([
    walletSaga(),
    translationSaga(),
    transactionSaga(),
    orderSaga(),
    accountSaga()
  ])
}
