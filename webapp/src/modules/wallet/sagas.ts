import { all, takeEvery } from 'redux-saga/effects'
import { CHANGE_ACCOUNT, DISCONNECT_WALLET } from 'decentraland-dapps/dist/modules/wallet/actions'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import { config } from '../../config'
import { TRANSACTIONS_API_URL } from './utils'

const baseWalletSaga = createWalletSaga({
  CHAIN_ID: Number(config.get('CHAIN_ID')),
  POLL_INTERVAL: 0,
  TRANSACTIONS_API_URL
})

export function* walletSaga() {
  yield all([baseWalletSaga(), customWalletSaga()])
}

function* customWalletSaga() {
  yield takeEvery(CHANGE_ACCOUNT, handleChangeOrDisconnectAccount)
  yield takeEvery(DISCONNECT_WALLET, handleChangeOrDisconnectAccount)
}

// eslint-disable-next-line require-yield
function* handleChangeOrDisconnectAccount() {
  window.location.reload()
}
