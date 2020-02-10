import { takeEvery, all, put } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS
} from 'decentraland-dapps/dist/modules/wallet/actions'

import { fetchAuthorizationRequest } from '../authorization/actions'
import { AuthorizationsRequest } from '../authorization/types'
import { contractAddresses } from '../contract/utils'

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
    EstateRegistry,
    ExclusiveMasksCollection,
    Halloween2019Collection,
    Xmas2019Collection,
    DCLRegistrar,
    Bids
  } = contractAddresses

  const authorization: AuthorizationsRequest = {
    allowances: {
      [Marketplace]: [MANAToken],
      [Bids]: [MANAToken]
    },
    approvals: {
      [Marketplace]: [
        LANDRegistry,
        EstateRegistry,
        ExclusiveMasksCollection,
        Halloween2019Collection,
        Xmas2019Collection,
        DCLRegistrar
      ]
    }
  }

  yield put(fetchAuthorizationRequest(address, authorization))
}
