import { takeEvery, all, put } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS
} from 'decentraland-dapps/dist/modules/wallet/actions'

import { fetchAuthorizationRequest } from '../authorization/actions'
import { MANAToken } from '../contracts'

const baseWalletSaga = createWalletSaga({ MANA_ADDRESS: MANAToken })

export function* walletSaga() {
  yield all([baseWalletSaga(), fullWalletSaga()])
}

function* fullWalletSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
  const { address } = action.payload.wallet

  const authorization = {
    allowances: {
      Marketplace: ['MANAToken'],
      LegacyMarketplace: ['MANAToken'],
      MortgageHelper: ['MANAToken'],
      MortgageManager: ['RCNToken']
    },
    approvals: {
      Marketplace: ['LANDRegistry', 'EstateRegistry']
    }
  }

  yield put(fetchAuthorizationRequest(address, authorization))
}
