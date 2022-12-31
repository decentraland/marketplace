import { all } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import { config } from '../../config'
import { TRANSACTIONS_API_URL } from './utils'

const baseWalletSaga = createWalletSaga({
  CHAIN_ID: Number(config.get('CHAIN_ID')!),
  POLL_INTERVAL: 0,
  TRANSACTIONS_API_URL
})

export function* walletSaga() {
  yield all([baseWalletSaga()])
}
