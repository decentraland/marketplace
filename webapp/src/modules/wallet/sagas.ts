import { takeEvery, all, put } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS
} from 'decentraland-dapps/dist/modules/wallet/actions'

import { fetchAuthorizationRequest } from '../authorization/actions'
import { AuthorizationRequest } from '../authorization/types'
import { contractAddresses } from '../contract/addresses'

const baseWalletSaga = createWalletSaga({
  MANA_ADDRESS: contractAddresses.MANAToken
})

export function* walletSaga() {
  yield all([baseWalletSaga(), fullWalletSaga()])
}

function* fullWalletSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
  const { address } = action.payload.wallet

  const {
    MANAToken,
    Marketplace,
    LANDRegistry,
    EstateRegistry
  } = contractAddresses

  const authorization: AuthorizationRequest = {
    allowances: {
      [Marketplace]: [MANAToken]
    },
    approvals: {
      [Marketplace]: [LANDRegistry, EstateRegistry]
    }
  }

  yield put(fetchAuthorizationRequest(address, authorization))
}
